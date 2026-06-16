import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, reviewsTable, productsTable } from "../db";
import {
  ListReviewsParams,
  ListReviewsResponse,
  CreateReviewParams,
  CreateReviewBody,
  ListReviewsResponseItem,
} from "../../shared";

const router: IRouter = Router();

router.get("/products/:productId/reviews", async (req, res): Promise<void> => {
  const params = ListReviewsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const rows = await db
    .select()
    .from(reviewsTable)
    .where(eq(reviewsTable.productId, params.data.productId))
    .orderBy(desc(reviewsTable.createdAt));
  res.json(ListReviewsResponse.parse(rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }))));
});

router.post("/products/:productId/reviews", async (req, res): Promise<void> => {
  const params = CreateReviewParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = CreateReviewBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const result = await db.insert(reviewsTable).values({ ...parsed.data, productId: params.data.productId });
  const insertedId = (result as any).insertId ?? (result as any)[0]?.insertId;
  const [review] = await db.select().from(reviewsTable).where(eq(reviewsTable.id, insertedId));

  const allReviews = await db
    .select()
    .from(reviewsTable)
    .where(eq(reviewsTable.productId, params.data.productId));

  const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
  await db
    .update(productsTable)
    .set({ rating: Math.round(avgRating * 10) / 10, reviewCount: allReviews.length })
    .where(eq(productsTable.id, params.data.productId));

  res.status(201).json(ListReviewsResponseItem.parse({ ...review, createdAt: review.createdAt.toISOString() }));
});

export default router;
