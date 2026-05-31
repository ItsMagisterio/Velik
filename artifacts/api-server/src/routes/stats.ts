import { Router, type IRouter } from "express";
import { eq, count, sum } from "drizzle-orm";
import { db, productsTable, ordersTable, usersTable, repairRequestsTable } from "@workspace/db";
import { GetStatsSummaryResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/stats/summary", async (_req, res): Promise<void> => {
  const [totalProducts] = await db.select({ count: count() }).from(productsTable);
  const [totalOrders] = await db.select({ count: count() }).from(ordersTable);
  const [revenueRow] = await db.select({ total: sum(ordersTable.total) }).from(ordersTable);
  const [newOrders] = await db
    .select({ count: count() })
    .from(ordersTable)
    .where(eq(ordersTable.status, "pending"));
  const [pendingRepairs] = await db
    .select({ count: count() })
    .from(repairRequestsTable)
    .where(eq(repairRequestsTable.status, "new"));
  const [totalUsers] = await db.select({ count: count() }).from(usersTable);

  res.json(
    GetStatsSummaryResponse.parse({
      totalProducts: totalProducts?.count ?? 0,
      totalOrders: totalOrders?.count ?? 0,
      totalRevenue: Number(revenueRow?.total ?? 0),
      newOrders: newOrders?.count ?? 0,
      pendingRepairs: pendingRepairs?.count ?? 0,
      totalUsers: totalUsers?.count ?? 0,
    }),
  );
});

export default router;
