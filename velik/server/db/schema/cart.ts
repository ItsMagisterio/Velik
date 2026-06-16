import { mysqlTable, serial, int, text, timestamp } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const cartItemsTable = mysqlTable("cart_items", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  productId: int("product_id").notNull(),
  quantity: int("quantity").notNull().default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCartItemSchema = createInsertSchema(cartItemsTable).omit({ id: true, createdAt: true });
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CartItem = typeof cartItemsTable.$inferSelect;
