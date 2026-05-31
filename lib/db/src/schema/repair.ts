import { pgTable, text, serial, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const repairRequestsTable = pgTable("repair_requests", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerEmail: text("customer_email"),
  bikeDescription: text("bike_description").notNull(),
  problemDescription: text("problem_description"),
  status: text("status").notNull().default("new"),
  estimatedCost: real("estimated_cost"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertRepairRequestSchema = createInsertSchema(repairRequestsTable).omit({ id: true, createdAt: true });
export type InsertRepairRequest = z.infer<typeof insertRepairRequestSchema>;
export type RepairRequest = typeof repairRequestsTable.$inferSelect;
