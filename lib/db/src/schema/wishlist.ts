import { mysqlTable, serial, int, timestamp } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const wishlistTable = mysqlTable("wishlist", {
  id: serial("id").primaryKey(),
  userId: int("user_id").notNull(),
  productId: int("product_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertWishlistSchema = createInsertSchema(wishlistTable).omit({ id: true, createdAt: true });
export type InsertWishlist = z.infer<typeof insertWishlistSchema>;
export type WishlistItem = typeof wishlistTable.$inferSelect;
