import { Router, type IRouter } from "express";
import { eq, and, desc } from "drizzle-orm";
import { db, notificationsTable, usersTable } from "@workspace/db";
import { ListNotificationsResponse, MarkNotificationReadParams, GetUnreadNotificationsCountResponse, DeleteNotificationParams } from "@workspace/api-zod";

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

router.get("/notifications", async (req, res): Promise<void> => {
  const user = await getUserFromRequest(req);
  if (!user) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  const rows = await db
    .select()
    .from(notificationsTable)
    .where(eq(notificationsTable.userId, user.id))
    .orderBy(desc(notificationsTable.createdAt));
  res.json(
    ListNotificationsResponse.parse(
      rows.map((r) => ({
        ...r,
        isRead: r.isRead === 1,
        repairRequestId: r.repairRequestId ?? null,
        createdAt: r.createdAt.toISOString(),
      })),
    ),
  );
});

router.get("/notifications/unread-count", async (req, res): Promise<void> => {
  const user = await getUserFromRequest(req);
  if (!user) {
    res.json(GetUnreadNotificationsCountResponse.parse({ count: 0 }));
    return;
  }
  const rows = await db
    .select()
    .from(notificationsTable)
    .where(and(eq(notificationsTable.userId, user.id), eq(notificationsTable.isRead, 0)));
  res.json(GetUnreadNotificationsCountResponse.parse({ count: rows.length }));
});

router.patch("/notifications/read-all", async (req, res): Promise<void> => {
  const user = await getUserFromRequest(req);
  if (!user) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  await db
    .update(notificationsTable)
    .set({ isRead: 1 })
    .where(eq(notificationsTable.userId, user.id));
  res.sendStatus(204);
});

router.patch("/notifications/:id/read", async (req, res): Promise<void> => {
  const params = MarkNotificationReadParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const user = await getUserFromRequest(req);
  if (!user) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  await db
    .update(notificationsTable)
    .set({ isRead: 1 })
    .where(and(eq(notificationsTable.id, params.data.id), eq(notificationsTable.userId, user.id)));
  res.sendStatus(204);
});

router.delete("/notifications/:id", async (req, res): Promise<void> => {
  const params = DeleteNotificationParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const user = await getUserFromRequest(req);
  if (!user) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  await db
    .delete(notificationsTable)
    .where(and(eq(notificationsTable.id, params.data.id), eq(notificationsTable.userId, user.id)));
  res.sendStatus(204);
});

router.delete("/notifications", async (req, res): Promise<void> => {
  const user = await getUserFromRequest(req);
  if (!user) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  await db.delete(notificationsTable).where(eq(notificationsTable.userId, user.id));
  res.sendStatus(204);
});

export default router;
