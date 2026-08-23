import { Router } from "express";
import { z } from "zod";
import { db, genId } from "../db/index.js";
import { verifyAccessToken } from "../lib/tokens.js";
import { sendNotificationEmail } from "../lib/mailer.js";

export const leadsRouter = Router();

const leadSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name."),
  email: z.string().trim().email("Please enter a valid email address."),
  phone: z
    .string()
    .trim()
    .min(10, "Please enter a valid phone number.")
    .max(15, "Please enter a valid phone number."),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  source: z.enum(["contact_form", "project_enquiry"]),
  projectSlug: z.string().trim().optional().or(z.literal("")),
});

function optionalUserId(req) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) return null;
  try {
    const payload = verifyAccessToken(header.slice(7));
    return payload.type === "user" ? payload.sub : null;
  } catch {
    return null;
  }
}

leadsRouter.post("/", (req, res) => {
  const parsed = leadSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }
  const { name, email, phone, message, source, projectSlug } = parsed.data;

  let projectId = null;
  let projectName = null;
  if (projectSlug) {
    const project = db.prepare("SELECT id, name FROM Project WHERE slug = ?").get(projectSlug);
    projectId = project?.id ?? null;
    projectName = project?.name ?? null;
  }

  const id = genId("lead");
  db.prepare(
    `INSERT INTO Lead (id, name, email, phone, message, source, projectId, userId)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, name, email, phone, message || null, source, projectId, optionalUserId(req));

  res.status(201).json({ ok: true, id });

  // Notify the company by email in the background. Never blocks or fails
  // the response above — see lib/mailer.js for graceful no-op behaviour
  // when SMTP credentials are not yet configured.
  const sourceLabel = source === "project_enquiry" ? "Project enquiry" : "Contact form";
  sendNotificationEmail({
    subject: `New ${sourceLabel.toLowerCase()} — ${name}`,
    text: [
      `New ${sourceLabel.toLowerCase()} received on the RMR Realty website.`,
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      projectName ? `Project: ${projectName}` : null,
      message ? `Message: ${message}` : null,
      "",
      `Lead ID: ${id}`,
    ]
      .filter(Boolean)
      .join("\n"),
  }).catch(() => {});
});
