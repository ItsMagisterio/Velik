import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, repairRequestsTable } from "@workspace/db";
import {
  ListRepairRequestsResponse,
  CreateRepairRequestBody,
  UpdateRepairRequestParams,
  UpdateRepairRequestBody,
  UpdateRepairRequestResponse,
  ListRepairRequestsResponseItem,
} from "@workspace/api-zod";

const router: IRouter = Router();

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
  const result = await db.insert(repairRequestsTable).values(parsed.data);
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
  await db.update(repairRequestsTable).set(parsed.data).where(eq(repairRequestsTable.id, params.data.id));
  const [row] = await db.select().from(repairRequestsTable).where(eq(repairRequestsTable.id, params.data.id));
  if (!row) {
    res.status(404).json({ error: "Repair request not found" });
    return;
  }
  res.json(
    UpdateRepairRequestResponse.parse({ ...row, createdAt: row.createdAt.toISOString() }),
  );
});

export default router;
