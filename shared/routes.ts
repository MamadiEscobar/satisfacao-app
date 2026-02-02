import { z } from 'zod';
import { insertFeedbackSchema, feedback } from './schema';

export const api = {
  feedback: {
    vote: {
      method: 'POST' as const,
      path: '/api/feedback',
      input: insertFeedbackSchema,
      responses: {
        201: z.object({ ok: z.boolean() }),
        400: z.object({ message: z.string() }),
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/feedback',
      input: z.object({
        page: z.coerce.number().optional(),
        limit: z.coerce.number().optional(),
        date: z.string().optional(), // YYYY-MM-DD
      }).optional(),
      responses: {
        200: z.object({
          items: z.array(z.custom<typeof feedback.$inferSelect>()),
          total: z.number(),
          page: z.number(),
          limit: z.number(),
        }),
      },
    },
    stats: {
      method: 'GET' as const,
      path: '/api/feedback/stats',
      input: z.object({
        date: z.string().optional(),
      }).optional(),
      responses: {
        200: z.object({
          totals: z.record(z.number()),
          percentages: z.record(z.number()),
          total: z.number(),
        }),
      },
    },
    exportCsv: {
      method: 'GET' as const,
      path: '/api/export/csv',
      input: z.object({ date: z.string().optional() }).optional(),
      responses: {
        200: z.any(), // File download
      },
    },
    exportXlsx: {
      method: 'GET' as const,
      path: '/api/export/xlsx',
      input: z.object({ date: z.string().optional() }).optional(),
      responses: {
        200: z.any(), // File download
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
