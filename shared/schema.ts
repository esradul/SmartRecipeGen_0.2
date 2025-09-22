import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, numeric, timestamp, bigint } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const n8nToSupabase = pgTable("n8n_to_supabase", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedByDefaultAsIdentity(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  hubspot_crm_id: text("hubspot_crm_id"),
  thread_id: text("thread_id"),
  email: text("email"),
  permission: text("permission"),
  feedback: text("feedback"),
  human_reply: text("human_reply"),
  escalation: boolean("escalation"),
  Escalated_reply: text("Escalated_reply"),
  human_name: text("human_name"),
  draft_reply: text("draft_reply"),
  message_sent: boolean("message_sent"),
  edited: numeric("edited"),
  Customer_Email: text("Customer_Email"),
  Previous_Emails_Summary: text("Previous_Emails_Summary"),
  reasoning: text("reasoning"),
  thought_process: text("thought_process"),
  Availabilities: text("Availabilities"),
  CRM_notes: text("CRM_notes"),
  bookcall: boolean("bookcall"),
  Important_reply: text("Important_reply"),
  important: boolean("important"),
  customer_name: text("customer_name"),
  replied: boolean("replied"),
  email_subject: text("email_subject"),
  Escalated_replied: boolean("Escalated_replied"),
  Important_replied: boolean("Important_replied"),
  removed: boolean("removed"),
  from_knowledgebase: text("from_knowledgebase"),
  Objection_nai: boolean("Objection_nai"),
  image: boolean("image"),
  image_url: text("image_url"),
  image_analysis: text("image_analysis"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertN8nSchema = createInsertSchema(n8nToSupabase).omit({
  id: true,
  created_at: true,
});

export const updateN8nSchema = createInsertSchema(n8nToSupabase).partial().omit({
  id: true,
  created_at: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type N8nRecord = typeof n8nToSupabase.$inferSelect;
export type InsertN8nRecord = z.infer<typeof insertN8nSchema>;
export type UpdateN8nRecord = z.infer<typeof updateN8nSchema>;
