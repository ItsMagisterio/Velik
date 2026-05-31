import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, promotionsTable } from "@workspace/db";
import {
  ListPromotionsResponse,
  CreatePromotionBody,
  ListPromotionsResponseItem,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/promotions", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(promotionsTable)
    .where(eq(promotionsTable.isActive, true));

  res.json(
    ListPromotionsResponse.parse(
      rows.map((r) => ({
        ...r,
        expiresAt: r.expiresAt ? r.expiresAt.toISOString() : null,
      })),
    ),
  );
});

router.post("/promotions", async (req, res): Promise<void> => {
  const parsed = CreatePromotionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [row] = await db.insert(promotionsTable).values(parsed.data).returning();
  res.status(201).json(
    ListPromotionsResponseItem.parse({
      ...row,
      expiresAt: row.expiresAt ? row.expiresAt.toISOString() : null,
    }),
  );
});

export default router;
