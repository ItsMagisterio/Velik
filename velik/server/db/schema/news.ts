import { mysqlTable, text, serial, boolean, timestamp, varchar } from "drizzle-orm/mysql-core";

export const newsTable = mysqlTable("news", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  imageUrl: text("image_url"),
  isPublished: boolean("is_published").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
