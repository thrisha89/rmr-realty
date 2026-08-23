import { Router } from "express";
import { z } from "zod";
import { db, genId } from "../db/index.js";
import { matchIntent, SUPPORTED_LANGS } from "../lib/chatbotKnowledge.js";
import { sendNotificationEmail } from "../lib/mailer.js";

export const chatbotRouter = Router();

// Same business WhatsApp number used across the site (frontend/src/lib/constants.js).
// Kept in one place here too so the chat-lead endpoint can build a
// pre-filled wa.me link without a network round trip.
const WHATSAPP_NUMBER = "918122749118";

function buildWhatsAppLink({ name, phone, projectName }) {
  const lines = ["Hi RMR Realty, I'm interested in your projects."];
  if (projectName) lines[0] = `Hi RMR Realty, I'm interested in ${projectName}.`;
  if (name) lines.push(`Name: ${name}`);
  if (phone) lines.push(`Phone: ${phone}`);
  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

const messageSchema = z.object({
  visitorId: z.string().trim().min(1).max(100),
  message: z.string().trim().min(1).max(1000),
  // The currently selected site language, so the bot's reply follows
  // whichever language the visitor has the site set to. Optional/lenient —
  // any value outside the supported set safely falls back to English inside
  // matchIntent, so older frontend builds without this field keep working.
  lang: z.enum(SUPPORTED_LANGS).optional(),
});

chatbotRouter.post("/message", (req, res) => {
  const parsed = messageSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Message could not be sent." });
  }
  const { visitorId, message, lang } = parsed.data;

  let conversation = db
    .prepare("SELECT * FROM ChatbotConversation WHERE visitorId = ? ORDER BY createdAt DESC LIMIT 1")
    .get(visitorId);
  if (!conversation) {
    const id = genId("conv");
    db.prepare("INSERT INTO ChatbotConversation (id, visitorId) VALUES (?, ?)").run(id, visitorId);
    conversation = { id, visitorId };
  }

  db.prepare(
    "INSERT INTO ChatbotMessage (id, conversationId, role, content) VALUES (?, ?, 'user', ?)"
  ).run(genId("msg"), conversation.id, message);

  const { intentId, answer, quickReplies, requiresLead, projectSlug } = matchIntent(message, lang);

  db.prepare(
    "INSERT INTO ChatbotMessage (id, conversationId, role, content, matchedIntent) VALUES (?, ?, 'bot', ?, ?)"
  ).run(genId("msg"), conversation.id, answer, intentId);

  // For the "which projects do you have" intent, attach a live list of
  // published projects as tappable options — built from the same Project
  // table the rest of the site reads, so it always matches what's actually
  // published (no separate list to keep in sync inside the knowledge base).
  let projectOptions = [];
  if (intentId === "projects_list") {
    const rows = db
      .prepare("SELECT slug, name FROM Project ORDER BY sortOrder ASC")
      .all();
    projectOptions = rows.map((p) => ({ slug: p.slug, name: p.name }));
  }

  // If this answer is scoped to one specific project, also resolve that
  // project's name so the frontend can render a "View project page" /
  // "Enquire on WhatsApp" action without a second round trip.
  let project = null;
  if (projectSlug) {
    const row = db.prepare("SELECT slug, name FROM Project WHERE slug = ?").get(projectSlug);
    if (row) project = row;
  }

  res.json({
    answer,
    matched: Boolean(intentId),
    quickReplies: quickReplies || [],
    requiresLead: Boolean(requiresLead),
    project,
    projectOptions,
  });
});

// Lead capture from inside the chat widget itself. Deliberately lighter than
// the main /api/leads form (name + phone only — email is optional here,
// since forcing a full form mid-conversation defeats the point of a chat
// flow) but writes to the exact same Lead table, so it shows up in the
// admin Leads dashboard identically to a website form submission, tagged
// with source "chatbot". Also returns a pre-filled WhatsApp link so the
// visitor can immediately continue the conversation on WhatsApp if they'd
// rather text than wait for a callback.
const chatLeadSchema = z.object({
  visitorId: z.string().trim().min(1).max(100),
  name: z.string().trim().min(2, "Please enter your name."),
  phone: z
    .string()
    .trim()
    .min(10, "Please enter a valid phone number.")
    .max(15, "Please enter a valid phone number."),
  projectSlug: z.string().trim().optional().or(z.literal("")),
});

chatbotRouter.post("/lead", (req, res) => {
  const parsed = chatLeadSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }
  const { visitorId, name, phone, projectSlug } = parsed.data;

  let projectId = null;
  let projectName = null;
  if (projectSlug) {
    const proj = db.prepare("SELECT id, name FROM Project WHERE slug = ?").get(projectSlug);
    projectId = proj?.id ?? null;
    projectName = proj?.name ?? null;
  }

  // Chat leads don't collect an email address, but the Lead table requires
  // one — store a clearly-marked placeholder rather than changing the
  // shared schema, so this stays additive and doesn't touch the existing
  // contact-form lead flow or admin leads table rendering.
  const placeholderEmail = `chat-${phone}@no-email.rmrrealty`;

  const id = genId("lead");
  db.prepare(
    `INSERT INTO Lead (id, name, email, phone, message, source, projectId)
     VALUES (?, ?, ?, ?, ?, 'chatbot', ?)`
  ).run(id, name, placeholderEmail, phone, projectName ? `Chat enquiry — ${projectName}` : "Chat enquiry", projectId);

  const whatsappLink = buildWhatsAppLink({ name, phone, projectName });

  res.status(201).json({ ok: true, id, whatsappLink });

  sendNotificationEmail({
    subject: `New chatbot lead — ${name}`,
    text: [
      "New lead captured via the website chatbot.",
      "",
      `Name: ${name}`,
      `Phone: ${phone}`,
      projectName ? `Project: ${projectName}` : null,
      `Visitor ID: ${visitorId}`,
      "",
      `Lead ID: ${id}`,
    ]
      .filter(Boolean)
      .join("\n"),
  }).catch(() => {});
});
