import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const feedback = pgTable("feedback", {
  id: serial("id").primaryKey(),
  satisfaction: text("satisfaction").notNull(), // 'muito_satisfeito', 'satisfeito', 'insatisfeito'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertFeedbackSchema = createInsertSchema(feedback).pick({
  satisfaction: true,
});

export type Feedback = typeof feedback.$inferSelect;
export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;

export type FeedbackStats = {
  totals: {
    muito_satisfeito: number;
    satisfeito: number;
    insatisfeito: number;
  };
  percentages: {
    muito_satisfeito: number;
    satisfeito: number;
    insatisfeito: number;
  };
  total: number;
};
