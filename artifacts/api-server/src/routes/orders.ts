import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, ordersTable, orderItemsTable, productsTable, cartItemsTable } from "@workspace/db";
import {
  ListOrdersResponse,
  ListOrdersQueryParams,
  CreateOrderBody,
  GetOrderParams,
  GetOrderResponse,
  UpdateOrderParams,
  UpdateOrderBody,
  UpdateOrderResponse,
  ListOrdersResponseItem,
} from "@workspace/api-zod";

const router: IRouter = Router();

async function buildOrder(order: any) {
  const items = await db
    .select()
    .from(orderItemsTable)
    .where(eq(orderItemsTable.orderId, order.id));
  return {
    ...order,
    createdAt: order.createdAt instanceof Date ? order.createdAt.toISOString() : order.createdAt,
    items,
  };
}

router.get("/orders", async (req, res): Promise<void> => {
  const _qp = ListOrdersQueryParams.safeParse(req.query);
  const rows = await db
    .select()
    .from(ordersTable)
    .orderBy(desc(ordersTable.createdAt))
    .limit(50);

  const enriched = await Promise.all(rows.map(buildOrder));
  res.json(ListOrdersResponse.parse(enriched));
});

router.post("/orders", async (req, res): Promise<void> => {
  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { items, sessionId, ...orderData } = parsed.data;
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const result = await db.insert(ordersTable).values({ ...orderData, total });
  const orderId = (result as any).insertId ?? (result as any)[0]?.insertId;
  const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, orderId));

  await Promise.all(
    items.map(async (item) => {
      const [product] = await db.select().from(productsTable).where(eq(productsTable.id, item.productId));
      return db.insert(orderItemsTable).values({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        productName: product?.name ?? "Unknown",
        productImageUrl: product?.imageUrl ?? "",
      });
    }),
  );

  if (sessionId) {
    await db.delete(cartItemsTable).where(eq(cartItemsTable.sessionId, sessionId));
  }

  const enriched = await buildOrder(order);
  res.status(201).json(ListOrdersResponseItem.parse(enriched));
});

router.get("/orders/:id", async (req, res): Promise<void> => {
  const params = GetOrderParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, params.data.id));
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  const enriched = await buildOrder(order);
  res.json(GetOrderResponse.parse(enriched));
});

router.patch("/orders/:id", async (req, res): Promise<void> => {
  const params = UpdateOrderParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  await db.update(ordersTable).set(parsed.data).where(eq(ordersTable.id, params.data.id));
  const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, params.data.id));
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  const enriched = await buildOrder(order);
  res.json(UpdateOrderResponse.parse(enriched));
});

export default router;
