import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { stringify } from "csv-stringify";
import ExcelJS from "exceljs";

const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin";

function checkAuth(req: Request): boolean {
  if (!ADMIN_PASSWORD) return true;
  const authHeader = req.headers.authorization;
  if (!authHeader) return false;

  const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
  const user = auth[0];
  const pass = auth[1];

  return user === ADMIN_USER && pass === ADMIN_PASSWORD;
}

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (checkAuth(req)) {
    next();
  } else {
    res.set('WWW-Authenticate', 'Basic realm="Admin Area"');
    res.status(401).send('Authentication required');
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Vote
  app.post(api.feedback.vote.path, async (req, res) => {
    try {
      const input = api.feedback.vote.input.parse(req.body);
      await storage.createFeedback(input);
      res.status(201).json({ ok: true });
    } catch (err) {
        if (err instanceof z.ZodError) {
            res.status(400).json({ message: err.errors[0].message });
        } else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
  });

  // Stats (Admin only)
  app.get(api.feedback.stats.path, requireAuth, async (req, res) => {
    const date = req.query.date as string | undefined;
    const compareDate = req.query.compareDate as string | undefined;
    const stats = await storage.getFeedbackStats(date, compareDate);
    res.json(stats);
  });

  // List (Admin only)
  app.get(api.feedback.list.path, requireAuth, async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const date = req.query.date as string | undefined;
    
    const result = await storage.getFeedbackList(page, limit, date);
    res.json({ ...result, page, limit });
  });

  // Export CSV (Admin only)
  app.get(api.feedback.exportCsv.path, requireAuth, async (req, res) => {
    const date = req.query.date as string | undefined;
    const items = await storage.getAllFeedback(date);
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="feedback.csv"');

    const stream = stringify({
      header: true,
      columns: ['id', 'satisfaction', 'createdAt'],
    });

    stream.pipe(res);
    
    for (const item of items) {
      stream.write({
        id: item.id,
        satisfaction: item.satisfaction,
        createdAt: item.createdAt.toISOString(),
      });
    }
    stream.end();
  });

  // Export TXT (Admin only)
  app.get(api.feedback.exportTxt.path, requireAuth, async (req, res) => {
    const date = req.query.date as string | undefined;
    const items = await storage.getAllFeedback(date);

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', 'attachment; filename="feedback.txt"');

    let content = "ID\tSatisfação\tData/Hora\n";
    content += "--------------------------------------------------\n";
    
    for (const item of items) {
      const dateStr = item.createdAt.toISOString();
      content += `${item.id}\t${item.satisfaction}\t${dateStr}\n`;
    }

    res.send(content);
  });

  return httpServer;
}
