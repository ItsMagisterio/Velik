import { mysqlTable, text, serial, int, float, boolean, json, timestamp } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const productsTable = mysqlTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  price: float("price").notNull(),
  oldPrice: float("old_price"),
  categoryId: int("category_id").notNull(),
  brand: text("brand").notNull(),
  inStock: boolean("in_stock").notNull().default(true),
  stockCount: int("stock_count").notNull().default(0),
  imageUrl: text("image_url").notNull(),
  images: json("images").$type<string[]>().notNull().default([]),
  rating: float("rating").notNull().default(0),
  reviewCount: int("review_count").notNull().default(0),
  badge: text("badge"),
  isFeatured: boolean("is_featured").notNull().default(false),
  isNew: boolean("is_new").notNull().default(false),
  discountPercent: int("discount_percent"),
  description: text("description"),
  specs: json("specs").$type<Record<string, string>>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertProductSchema = createInsertSchema(productsTable).omit({ id: true, createdAt: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof productsTable.$inferSelect;
