import { Router, type IRouter } from "express";
import { eq, desc, and } from "drizzle-orm";
import { db, repairRequestsTable, notificationsTable, usersTable } from "@workspace/db";
import {
  ListRepairRequestsResponse,
  CreateRepairRequestBody,
  UpdateRepairRequestParams,
  UpdateRepairRequestBody,
  UpdateRepairRequestResponse,
  ListRepairRequestsResponseItem,
} from "@workspace/api-zod";

const router: IRouter = Router();

function parseToken(token: string): number | null {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf8");
    const parts = decoded.split(":");
    return parseInt(parts[0], 10);
  } catch {
    return null;
  }
}

async function getUserFromRequest(req: any) {
  const auth = req.headers["authorization"];
  if (!auth?.startsWith("Bearer ")) return null;
  const token = auth.slice(7);
  const userId = parseToken(token);
  if (!userId) return null;
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  return user ?? null;
}

const STATUS_LABELS: Record<string, string> = {
  new: "Новая",
  in_progress: "В работе",
  completed: "Завершена",
  cancelled: "Отменена",
};

router.get("/repair-requests", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(repairRequestsTable)
    .orderBy(desc(repairRequestsTable.createdAt));
  res.json(
    ListRepairRequestsResponse.parse(rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }))),
  );
});

router.post("/repair-requests", async (req, res): Promise<void> => {
  const parsed = CreateRepairRequestBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const user = await getUserFromRequest(req);

  const result = await db.insert(repairRequestsTable).values({
    ...parsed.data,
    userId: user ? user.id : null,
  });
  const insertedId = (result as any).insertId ?? (result as any)[0]?.insertId;
  const [row] = await db.select().from(repairRequestsTable).where(eq(repairRequestsTable.id, insertedId));
  res.status(201).json(
    ListRepairRequestsResponseItem.parse({ ...row, createdAt: row.createdAt.toISOString() }),
  );
});

router.patch("/repair-requests/:id", async (req, res): Promise<void> => {
  const params = UpdateRepairRequestParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateRepairRequestBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [before] = await db.select().from(repairRequestsTable).where(eq(repairRequestsTable.id, params.data.id));
  if (!before) {
    res.status(404).json({ error: "Repair request not found" });
    return;
  }

  await db.update(repairRequestsTable).set(parsed.data).where(eq(repairRequestsTable.id, params.data.id));
  const [row] = await db.select().from(repairRequestsTable).where(eq(repairRequestsTable.id, params.data.id));
  if (!row) {
    res.status(404).json({ error: "Repair request not found" });
    return;
  }

  if (row.userId) {
    const lines: string[] = [];

    if (parsed.data.status && parsed.data.status !== before.status) {
      const newLabel = STATUS_LABELS[parsed.data.status] ?? parsed.data.status;
      lines.push(`• Статус изменён на «${newLabel}»`);
    }

    if (
      parsed.data.estimatedCost !== undefined &&
      parsed.data.estimatedCost !== before.estimatedCost
    ) {
      const cost = parsed.data.estimatedCost;
      lines.push(
        cost != null
          ? `• Стоимость ремонта оценена в ${cost.toLocaleString("ru-RU")} BYN`
          : `• Оценка стоимости удалена`,
      );
    }

    if (lines.length > 0) {
      const [existing] = await db
        .select()
        .from(notificationsTable)
        .where(
          and(
            eq(notificationsTable.userId, row.userId),
            eq(notificationsTable.repairRequestId, row.id),
            eq(notificationsTable.isRead, 0),
          ),
        )
        .limit(1);

      if (existing) {
        const updatedMessage = existing.message + "\n" + lines.join("\n");
        await db
          .update(notificationsTable)
          .set({ message: updatedMessage, isRead: 0 })
          .where(eq(notificationsTable.id, existing.id));
      } else {
        await db.insert(notificationsTable).values({
          userId: row.userId,
          type: "repair_update",
          title: `Обновление заявки #${row.id}`,
          message: `${row.bikeDescription}:\n` + lines.join("\n"),
          repairRequestId: row.id,
          isRead: 0,
        });
      }
    }
  }

  res.json(
    UpdateRepairRequestResponse.parse({ ...row, createdAt: row.createdAt.toISOString() }),
  );
});

router.delete("/repair-requests/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [row] = await db.select().from(repairRequestsTable).where(eq(repairRequestsTable.id, id));
  if (!row) {
    res.status(404).json({ error: "Repair request not found" });
    return;
  }
  await db.delete(notificationsTable).where(eq(notificationsTable.repairRequestId, id));
  await db.delete(repairRequestsTable).where(eq(repairRequestsTable.id, id));
  res.sendStatus(204);
});

export default router;
