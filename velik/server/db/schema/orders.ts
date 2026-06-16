import { mysqlTable, text, serial, int, float, timestamp } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const ordersTable = mysqlTable("orders", {
  id: serial("id").primaryKey(),
  status: text("status").notNull().default("pending"),
  total: float("total").notNull(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerEmail: text("customer_email"),
  deliveryAddress: text("delivery_address"),
  deliveryMethod: text("delivery_method").notNull().default("delivery"),
  paymentMethod: text("payment_method").notNull().default("cash"),
  comment: text("comment"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orderItemsTable = mysqlTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: int("order_id").notNull(),
  productId: int("product_id").notNull(),
  quantity: int("quantity").notNull(),
  price: float("price").notNull(),
  productName: text("product_name").notNull(),
  productImageUrl: text("product_image_url").notNull(),
});

export const insertOrderSchema = createInsertSchema(ordersTable).omit({ id: true, createdAt: true });
export const insertOrderItemSchema = createInsertSchema(orderItemsTable).omit({ id: true });
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type Order = typeof ordersTable.$inferSelect;
export type OrderItem = typeof orderItemsTable.$inferSelect;
