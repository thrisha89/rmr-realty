import { Router } from "express";
import { z } from "zod";
import { db } from "../db/index.js";
import { requireAdmin } from "../middleware/auth.js";

export const adminRouter = Router();
adminRouter.use(requireAdmin);

// ---- Dashboard ----
adminRouter.get("/dashboard", (_req, res) => {
  const leadCount = db.prepare("SELECT COUNT(*) AS c FROM Lead").get().c;
  const newLeadCount = db.prepare("SELECT COUNT(*) AS c FROM Lead WHERE status = 'new'").get().c;
  const brokerCount = db.prepare("SELECT COUNT(*) AS c FROM BrokerRegistration").get().c;
  const projectCount = db.prepare("SELECT COUNT(*) AS c FROM Project").get().c;
  const conversationCount = db.prepare("SELECT COUNT(*) AS c FROM ChatbotConversation").get().c;
  const pageViewCount = db.prepare("SELECT COUNT(*) AS c FROM PageView").get().c;
  const searchQueryCount = db.prepare("SELECT COUNT(*) AS c FROM SearchQuery").get().c;

  res.json({
    stats: {
      leadCount,
      newLeadCount,
      brokerCount,
      projectCount,
      conversationCount,
      pageViewCount,
      searchQueryCount,
    },
  });
});

// ---- Registered users / approval queue ----
adminRouter.get("/users", (req, res) => {
  const statusFilter = req.query.status; // pending | approved | rejected | undefined (all)
  let users;
  if (statusFilter && ["pending", "approved", "rejected"].includes(statusFilter)) {
    users = db
      .prepare(
        "SELECT id, fullName, email, phone, status, reviewedAt, reviewedBy, createdAt FROM User WHERE status = ? ORDER BY createdAt DESC"
      )
      .all(statusFilter);
  } else {
    users = db
      .prepare(
        "SELECT id, fullName, email, phone, status, reviewedAt, reviewedBy, createdAt FROM User ORDER BY createdAt DESC"
      )
      .all();
  }
  const counts = db
    .prepare("SELECT status, COUNT(*) AS c FROM User GROUP BY status")
    .all()
    .reduce((acc, row) => ({ ...acc, [row.status]: row.c }), { pending: 0, approved: 0, rejected: 0 });
  res.json({ users, counts });
});

adminRouter.patch("/users/:id/approve", (req, res) => {
  const existing = db.prepare("SELECT * FROM User WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "User not found." });
  db.prepare(
    "UPDATE User SET status = 'approved', reviewedAt = datetime('now'), reviewedBy = ?, updatedAt = datetime('now') WHERE id = ?"
  ).run(req.admin?.sub || null, req.params.id);
  const user = db
    .prepare("SELECT id, fullName, email, phone, status, reviewedAt, reviewedBy, createdAt FROM User WHERE id = ?")
    .get(req.params.id);
  res.json({ user });
});

adminRouter.patch("/users/:id/reject", (req, res) => {
  const existing = db.prepare("SELECT * FROM User WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "User not found." });
  db.prepare(
    "UPDATE User SET status = 'rejected', reviewedAt = datetime('now'), reviewedBy = ?, updatedAt = datetime('now') WHERE id = ?"
  ).run(req.admin?.sub || null, req.params.id);
  const user = db
    .prepare("SELECT id, fullName, email, phone, status, reviewedAt, reviewedBy, createdAt FROM User WHERE id = ?")
    .get(req.params.id);
  res.json({ user });
});

// Revert a decision back to pending (undo safety net for admins)
adminRouter.patch("/users/:id/reset", (req, res) => {
  const existing = db.prepare("SELECT * FROM User WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "User not found." });
  db.prepare(
    "UPDATE User SET status = 'pending', reviewedAt = NULL, reviewedBy = NULL, updatedAt = datetime('now') WHERE id = ?"
  ).run(req.params.id);
  const user = db
    .prepare("SELECT id, fullName, email, phone, status, reviewedAt, reviewedBy, createdAt FROM User WHERE id = ?")
    .get(req.params.id);
  res.json({ user });
});

// ---- Leads ----
adminRouter.get("/leads", (_req, res) => {
  const leads = db
    .prepare(
      `SELECT Lead.*, Project.name AS projectName
       FROM Lead LEFT JOIN Project ON Project.id = Lead.projectId
       ORDER BY Lead.createdAt DESC`
    )
    .all();
  res.json({ leads });
});

adminRouter.patch("/leads/:id", (req, res) => {
  const schema = z.object({ status: z.enum(["new", "contacted", "closed"]) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid status." });
  const result = db
    .prepare("UPDATE Lead SET status = ? WHERE id = ?")
    .run(parsed.data.status, req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: "Lead not found." });
  const lead = db.prepare("SELECT * FROM Lead WHERE id = ?").get(req.params.id);
  res.json({ lead });
});

// ---- Brokers ----
adminRouter.get("/brokers", (_req, res) => {
  const brokers = db.prepare("SELECT * FROM BrokerRegistration ORDER BY createdAt DESC").all();
  res.json({ brokers });
});

adminRouter.patch("/brokers/:id", (req, res) => {
  const schema = z.object({ status: z.enum(["new", "contacted", "closed"]) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid status." });
  const result = db
    .prepare("UPDATE BrokerRegistration SET status = ? WHERE id = ?")
    .run(parsed.data.status, req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: "Broker not found." });
  const broker = db.prepare("SELECT * FROM BrokerRegistration WHERE id = ?").get(req.params.id);
  res.json({ broker });
});

// ---- Projects ----
adminRouter.get("/projects", (_req, res) => {
  const projects = db.prepare("SELECT * FROM Project ORDER BY sortOrder ASC").all();
  const withRelations = projects.map((p) => ({
    ...p,
    isVerified: Boolean(p.isVerified),
    media: db.prepare("SELECT * FROM ProjectMedia WHERE projectId = ? ORDER BY sortOrder").all(p.id),
    amenities: db.prepare("SELECT * FROM ProjectAmenity WHERE projectId = ?").all(p.id),
  }));
  res.json({ projects: withRelations });
});

const projectUpdateSchema = z.object({
  name: z.string().trim().min(1).optional(),
  location: z.string().trim().nullable().optional(),
  category: z.string().trim().nullable().optional(),
  priceLabel: z.string().trim().nullable().optional(),
  description: z.string().trim().nullable().optional(),
  isVerified: z.boolean().optional(),
  videoUrl: z.string().trim().nullable().optional(),
});

adminRouter.patch("/projects/:id", (req, res) => {
  const parsed = projectUpdateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid project data." });

  const existing = db.prepare("SELECT * FROM Project WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Project not found." });

  const merged = { ...existing, ...parsed.data };
  db.prepare(
    `UPDATE Project SET name=?, location=?, category=?, priceLabel=?, description=?, isVerified=?, videoUrl=?, updatedAt=datetime('now')
     WHERE id=?`
  ).run(
    merged.name,
    merged.location,
    merged.category,
    merged.priceLabel,
    merged.description,
    merged.isVerified ? 1 : 0,
    merged.videoUrl,
    req.params.id
  );

  const project = db.prepare("SELECT * FROM Project WHERE id = ?").get(req.params.id);
  res.json({ project: { ...project, isVerified: Boolean(project.isVerified) } });
});

// ---- Content blocks ----
adminRouter.get("/content", (_req, res) => {
  const blocks = db.prepare("SELECT * FROM ContentBlock").all();
  res.json({ blocks });
});

adminRouter.patch("/content/:key", (req, res) => {
  const schema = z.object({ value: z.string() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid content value." });
  const result = db
    .prepare("UPDATE ContentBlock SET value = ?, updatedAt = datetime('now') WHERE key = ?")
    .run(parsed.data.value, req.params.key);
  if (result.changes === 0) return res.status(404).json({ error: "Content block not found." });
  const block = db.prepare("SELECT * FROM ContentBlock WHERE key = ?").get(req.params.key);
  res.json({ block });
});

// ---- Chatbot conversations (read-only viewer) ----
adminRouter.get("/chatbot/conversations", (_req, res) => {
  const conversations = db
    .prepare("SELECT * FROM ChatbotConversation ORDER BY createdAt DESC LIMIT 100")
    .all();
  const withMessages = conversations.map((c) => ({
    ...c,
    messages: db
      .prepare("SELECT * FROM ChatbotMessage WHERE conversationId = ? ORDER BY createdAt ASC")
      .all(c.id),
  }));
  res.json({ conversations: withMessages });
});

// ---- Visitor / page-view activity ----
adminRouter.get("/visitors/pageviews", (_req, res) => {
  const recent = db
    .prepare("SELECT * FROM PageView ORDER BY createdAt DESC LIMIT 200")
    .all();
  const topPaths = db
    .prepare(
      `SELECT path, COUNT(*) AS views
       FROM PageView
       GROUP BY path
       ORDER BY views DESC
       LIMIT 20`
    )
    .all();
  const uniqueVisitors = db
    .prepare(
      "SELECT COUNT(DISTINCT visitorId) AS c FROM PageView WHERE visitorId IS NOT NULL"
    )
    .get().c;

  res.json({ recent, topPaths, uniqueVisitors });
});

// ---- Search / query activity ----
adminRouter.get("/visitors/searches", (_req, res) => {
  const recent = db
    .prepare("SELECT * FROM SearchQuery ORDER BY createdAt DESC LIMIT 200")
    .all();
  const topQueries = db
    .prepare(
      `SELECT query, COUNT(*) AS count
       FROM SearchQuery
       GROUP BY query
       ORDER BY count DESC
       LIMIT 20`
    )
    .all();

  res.json({ recent, topQueries });
});
