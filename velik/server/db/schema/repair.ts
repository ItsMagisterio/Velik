import { mysqlTable, text, serial, float, int, timestamp } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const repairRequestsTable = mysqlTable("repair_requests", {
  id: serial("id").primaryKey(),
  userId: int("user_id"),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerEmail: text("customer_email"),
  bikeDescription: text("bike_description").notNull(),
  problemDescription: text("problem_description"),
  status: text("status").notNull().default("new"),
  estimatedCost: float("estimated_cost"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertRepairRequestSchema = createInsertSchema(repairRequestsTable).omit({ id: true, createdAt: true });
export type InsertRepairRequest = z.infer<typeof insertRepairRequestSchema>;
export type RepairRequest = typeof repairRequestsTable.$inferSelect;
