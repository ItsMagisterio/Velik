import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, cartItemsTable, productsTable } from "../db";
import {
  GetCartResponse,
  AddCartItemBody,
  UpdateCartItemParams,
  UpdateCartItemBody,
  UpdateCartItemResponse,
  RemoveCartItemParams,
} from "../../shared";

const SESSION_ID_HEADER = "x-session-id";

function getSessionId(req: any): string {
  const raw = req.headers[SESSION_ID_HEADER] || req.query.sessionId || "default";
  return Array.isArray(raw) ? raw[0] : raw;
}

async function buildCart(sessionId: string) {
  const items = await db
    .select()
    .from(cartItemsTable)
    .where(eq(cartItemsTable.sessionId, sessionId));

  const enriched = await Promise.all(
    items.map(async (item) => {
      const [product] = await db.select().from(productsTable).where(eq(productsTable.id, item.productId));
      return {
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        product: { ...product, categoryName: null },
      };
    }),
  );

  const total = enriched.reduce((sum, item) => sum + (item.product?.price ?? 0) * item.quantity, 0);
  const itemCount = enriched.reduce((sum, item) => sum + item.quantity, 0);

  return { items: enriched.filter((i) => i.product), total, itemCount };
}

const router: IRouter = Router();

router.get("/cart", async (req, res): Promise<void> => {
  const sessionId = getSessionId(req);
  const cart = await buildCart(sessionId);
  res.json(GetCartResponse.parse(cart));
});

router.post("/cart/items", async (req, res): Promise<void> => {
  const parsed = AddCartItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const sessionId = parsed.data.sessionId ?? getSessionId(req);

  const [existing] = await db
    .select()
    .from(cartItemsTable)
    .where(and(eq(cartItemsTable.sessionId, sessionId), eq(cartItemsTable.productId, parsed.data.productId)));

  if (existing) {
    const newQty = existing.quantity + parsed.data.quantity;
    await db.update(cartItemsTable).set({ quantity: newQty }).where(eq(cartItemsTable.id, existing.id));
    const [product] = await db.select().from(productsTable).where(eq(productsTable.id, existing.productId));
    res.status(201).json({ id: existing.id, productId: existing.productId, quantity: newQty, product: { ...product, categoryName: null } });
    return;
  }

  const result = await db.insert(cartItemsTable).values({ sessionId, productId: parsed.data.productId, quantity: parsed.data.quantity });
  const insertedId = (result as any).insertId ?? (result as any)[0]?.insertId;
  const [item] = await db.select().from(cartItemsTable).where(eq(cartItemsTable.id, insertedId));
  const [product] = await db.select().from(productsTable).where(eq(productsTable.id, item.productId));
  res.status(201).json({ id: item.id, productId: item.productId, quantity: item.quantity, product: { ...product, categoryName: null } });
});

router.patch("/cart/items/:itemId", async (req, res): Promise<void> => {
  const params = UpdateCartItemParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateCartItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  await db.update(cartItemsTable).set({ quantity: parsed.data.quantity }).where(eq(cartItemsTable.id, params.data.itemId));
  const [updated] = await db.select().from(cartItemsTable).where(eq(cartItemsTable.id, params.data.itemId));
  if (!updated) {
    res.status(404).json({ error: "Cart item not found" });
    return;
  }
  const [product] = await db.select().from(productsTable).where(eq(productsTable.id, updated.productId));
  res.json(UpdateCartItemResponse.parse({ id: updated.id, productId: updated.productId, quantity: updated.quantity, product: { ...product, categoryName: null } }));
});

router.delete("/cart/items/:itemId", async (req, res): Promise<void> => {
  const params = RemoveCartItemParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db.delete(cartItemsTable).where(eq(cartItemsTable.id, params.data.itemId));
  res.sendStatus(204);
});

router.delete("/cart/clear", async (req, res): Promise<void> => {
  const sessionId = getSessionId(req);
  await db.delete(cartItemsTable).where(eq(cartItemsTable.sessionId, sessionId));
  res.sendStatus(204);
});

export default router;
