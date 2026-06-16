import { mysqlTable, serial, json, timestamp } from "drizzle-orm/mysql-core";

export const installmentPageTable = mysqlTable("installment_page", {
  id: serial("id").primaryKey(),
  content: json("content").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export type InstallmentPage = typeof installmentPageTable.$inferSelect;
