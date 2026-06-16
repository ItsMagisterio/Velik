import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, installmentPageTable } from "@workspace/db";

const router: IRouter = Router();
const PAGE_ID = 1;

router.get("/installment-page", async (_req, res): Promise<void> => {
  const [row] = await db.select().from(installmentPageTable).where(eq(installmentPageTable.id, PAGE_ID));
  res.json(row?.content ?? null);
});

router.patch("/installment-page", async (req, res): Promise<void> => {
  const content = req.body;
  if (!content || typeof content !== "object" || Array.isArray(content)) {
    res.status(400).json({ error: "Invalid installment page content" });
    return;
  }

  const [existing] = await db.select().from(installmentPageTable).where(eq(installmentPageTable.id, PAGE_ID));
  if (existing) {
    await db.update(installmentPageTable).set({ content }).where(eq(installmentPageTable.id, PAGE_ID));
  } else {
    await db.insert(installmentPageTable).values({ id: PAGE_ID, content });
  }

  const [row] = await db.select().from(installmentPageTable).where(eq(installmentPageTable.id, PAGE_ID));
  res.json(row.content);
});

export default router;
