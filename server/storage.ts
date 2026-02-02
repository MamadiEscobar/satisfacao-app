import { db } from "./db";
import { feedback, type InsertFeedback, type Feedback } from "@shared/schema";
import { eq, desc, sql, count, and } from "drizzle-orm";

export interface IStorage {
  createFeedback(feedback: InsertFeedback): Promise<Feedback>;
  getFeedbackList(page: number, limit: number, date?: string): Promise<{ items: Feedback[], total: number }>;
  getFeedbackStats(date?: string): Promise<{ totals: Record<string, number>, percentages: Record<string, number>, total: number }>;
  getAllFeedback(date?: string): Promise<Feedback[]>;
}

export class DatabaseStorage implements IStorage {
  async createFeedback(insertFeedback: InsertFeedback): Promise<Feedback> {
    const [newFeedback] = await db
      .insert(feedback)
      .values(insertFeedback)
      .returning();
    return newFeedback;
  }

  async getFeedbackList(page: number, limit: number, date?: string): Promise<{ items: Feedback[], total: number }> {
    let whereClause = undefined;
    if (date) {
      // Assuming date is YYYY-MM-DD, filter by day
      whereClause = sql`DATE(${feedback.createdAt}) = ${date}`;
    }

    const [totalResult] = await db
      .select({ count: count() })
      .from(feedback)
      .where(whereClause);
    
    const total = totalResult.count;

    const items = await db
      .select()
      .from(feedback)
      .where(whereClause)
      .orderBy(desc(feedback.createdAt))
      .limit(limit)
      .offset((page - 1) * limit);

    return { items, total };
  }

  async getAllFeedback(date?: string): Promise<Feedback[]> {
    let whereClause = undefined;
    if (date) {
        whereClause = sql`DATE(${feedback.createdAt}) = ${date}`;
    }
    return await db
      .select()
      .from(feedback)
      .where(whereClause)
      .orderBy(desc(feedback.createdAt));
  }

  async getFeedbackStats(date?: string): Promise<{ totals: Record<string, number>, percentages: Record<string, number>, total: number }> {
    let whereClause = undefined;
    if (date) {
      whereClause = sql`DATE(${feedback.createdAt}) = ${date}`;
    }

    const rows = await db
      .select({
        satisfaction: feedback.satisfaction,
        count: count(),
      })
      .from(feedback)
      .where(whereClause)
      .groupBy(feedback.satisfaction);

    const totals: Record<string, number> = {
      muito_satisfeito: 0,
      satisfeito: 0,
      insatisfeito: 0,
    };

    let total = 0;
    for (const row of rows) {
      if (row.satisfaction in totals) {
        totals[row.satisfaction] = Number(row.count);
        total += Number(row.count);
      }
    }

    const percentages: Record<string, number> = {};
    for (const key in totals) {
      percentages[key] = total > 0 ? (totals[key] / total) * 100 : 0;
    }

    return { totals, percentages, total };
  }
}

export const storage = new DatabaseStorage();
