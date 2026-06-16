import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, newsTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/news", async (_req, res): Promise<void> => {
  const rows = await db.select().from(newsTable).orderBy(desc(newsTable.createdAt));
  res.json(rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })));
});

router.get("/news/:id", async (req, res): Promise<void> => {
  const [row] = await db.select().from(newsTable).where(eq(newsTable.id, Number(req.params.id)));
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ ...row, createdAt: row.createdAt.toISOString() });
});

router.post("/news", async (req, res): Promise<void> => {
  const { title, slug, content, excerpt, imageUrl, isPublished } = req.body;
  if (!title || !slug || !content) {
    res.status(400).json({ error: "title, slug, content are required" });
    return;
  }
  const result = await db.insert(newsTable).values({
    title, slug, content,
    excerpt: excerpt ?? null,
    imageUrl: imageUrl ?? null,
    isPublished: isPublished !== false,
  });
  const insertedId = (result as any).insertId ?? (result as any)[0]?.insertId;
  const [row] = await db.select().from(newsTable).where(eq(newsTable.id, insertedId));
  res.status(201).json({ ...row, createdAt: row.createdAt.toISOString() });
});

router.patch("/news/:id", async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  const { title, slug, content, excerpt, imageUrl, isPublished } = req.body;
  const updates: Record<string, unknown> = {};
  if (title !== undefined) updates.title = title;
  if (slug !== undefined) updates.slug = slug;
  if (content !== undefined) updates.content = content;
  if (excerpt !== undefined) updates.excerpt = excerpt;
  if (imageUrl !== undefined) updates.imageUrl = imageUrl;
  if (isPublished !== undefined) updates.isPublished = isPublished;
  if (Object.keys(updates).length === 0) {
    res.status(400).json({ error: "No fields to update" });
    return;
  }
  await db.update(newsTable).set(updates).where(eq(newsTable.id, id));
  const [row] = await db.select().from(newsTable).where(eq(newsTable.id, id));
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ ...row, createdAt: row.createdAt.toISOString() });
});

router.delete("/news/:id", async (req, res): Promise<void> => {
  await db.delete(newsTable).where(eq(newsTable.id, Number(req.params.id)));
  res.sendStatus(204);
});

export default router;
