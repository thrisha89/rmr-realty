import { Router } from "express";
import { z } from "zod";
import { db, genId } from "../db/index.js";

export const trackingRouter = Router();

const pageViewSchema = z.object({
  path: z.string().trim().min(1).max(500),
  referrer: z.string().trim().max(500).optional().or(z.literal("")),
  visitorId: z.string().trim().max(100).optional().or(z.literal("")),
});

trackingRouter.post("/pageview", (req, res) => {
  const parsed = pageViewSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid page view data." });
  const { path, referrer, visitorId } = parsed.data;

  db.prepare(
    "INSERT INTO PageView (id, path, referrer, visitorId, userAgent) VALUES (?, ?, ?, ?, ?)"
  ).run(
    genId("pv"),
    path,
    referrer || null,
    visitorId || null,
    (req.headers["user-agent"] || "").slice(0, 300)
  );

  res.status(201).json({ ok: true });
});

const searchSchema = z.object({
  query: z.string().trim().min(1).max(200),
  resultsCount: z.number().int().min(0).max(100000).optional(),
  visitorId: z.string().trim().max(100).optional().or(z.literal("")),
});

trackingRouter.post("/search", (req, res) => {
  const parsed = searchSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid search data." });
  const { query, resultsCount, visitorId } = parsed.data;

  db.prepare(
    "INSERT INTO SearchQuery (id, query, resultsCount, visitorId) VALUES (?, ?, ?, ?)"
  ).run(genId("search"), query, resultsCount ?? null, visitorId || null);

  res.status(201).json({ ok: true });
});
