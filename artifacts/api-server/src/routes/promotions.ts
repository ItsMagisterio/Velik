import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, promotionsTable } from "@workspace/db";
import {
  ListPromotionsResponse,
  CreatePromotionBody,
  ListPromotionsResponseItem,
} from "@workspace/api-zod";

const router: IRouter = Router();

function serializePromotion(r: any) {
  return {
    ...r,
    expiresAt: r.expiresAt ? (r.expiresAt instanceof Date ? r.expiresAt.toISOString() : r.expiresAt) : null,
    createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : r.createdAt,
  };
}

router.get("/promotions", async (req, res): Promise<void> => {
  const showAll = req.query.all === "true";
  const rows = showAll
    ? await db.select().from(promotionsTable)
    : await db.select().from(promotionsTable).where(eq(promotionsTable.isActive, true));
  res.json(ListPromotionsResponse.parse(rows.map(serializePromotion)));
});

router.post("/promotions", async (req, res): Promise<void> => {
  const parsed = CreatePromotionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const data = {
    ...parsed.data,
    expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
  };
  const result = await db.insert(promotionsTable).values(data);
  const insertedId = (result as any).insertId ?? (result as any)[0]?.insertId;
  const [row] = await db.select().from(promotionsTable).where(eq(promotionsTable.id, insertedId));
  res.status(201).json(ListPromotionsResponseItem.parse(serializePromotion(row)));
});

router.patch("/promotions/:id", async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  const { title, description, discountPercent, imageUrl, isActive, expiresAt } = req.body;
  const updates: Record<string, unknown> = {};
  if (title !== undefined) updates.title = title;
  if (description !== undefined) updates.description = description;
  if (discountPercent !== undefined) updates.discountPercent = Number(discountPercent);
  if (imageUrl !== undefined) updates.imageUrl = imageUrl;
  if (isActive !== undefined) updates.isActive = isActive;
  if (expiresAt !== undefined) updates.expiresAt = expiresAt ? new Date(expiresAt) : null;
  if (Object.keys(updates).length === 0) {
    res.status(400).json({ error: "No fields to update" });
    return;
  }
  await db.update(promotionsTable).set(updates).where(eq(promotionsTable.id, id));
  const [row] = await db.select().from(promotionsTable).where(eq(promotionsTable.id, id));
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(serializePromotion(row));
});

router.delete("/promotions/:id", async (req, res): Promise<void> => {
  await db.delete(promotionsTable).where(eq(promotionsTable.id, Number(req.params.id)));
  res.sendStatus(204);
});

export default router;
