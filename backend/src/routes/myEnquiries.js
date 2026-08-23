import { Router } from "express";
import { db } from "../db/index.js";
import { requireAuth } from "../middleware/auth.js";

export const myEnquiriesRouter = Router();

myEnquiriesRouter.get("/", requireAuth, (req, res) => {
  if (req.user.type !== "user") return res.status(403).json({ error: "Not a customer session." });

  const leads = db
    .prepare(
      `SELECT Lead.*, Project.name AS projectName, Project.slug AS projectSlug
       FROM Lead
       LEFT JOIN Project ON Project.id = Lead.projectId
       WHERE Lead.userId = ?
       ORDER BY Lead.createdAt DESC`
    )
    .all(req.user.sub);

  res.json({ leads });
});
