import { Router } from "express";
import { z } from "zod";
import { db, genId } from "../db/index.js";
import { sendNotificationEmail } from "../lib/mailer.js";

export const brokersRouter = Router();

const brokerSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name."),
  phone: z
    .string()
    .trim()
    .min(10, "Please enter a valid phone number.")
    .max(15, "Please enter a valid phone number."),
  email: z.string().trim().email("Please enter a valid email address."),
  agencyName: z.string().trim().max(200).optional().or(z.literal("")),
});

brokersRouter.post("/", (req, res) => {
  const parsed = brokerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }
  const { fullName, phone, email, agencyName } = parsed.data;

  const id = genId("broker");
  db.prepare(
    "INSERT INTO BrokerRegistration (id, fullName, phone, email, agencyName) VALUES (?, ?, ?, ?, ?)"
  ).run(id, fullName, phone, email, agencyName || null);

  res.status(201).json({ ok: true, id });

  sendNotificationEmail({
    subject: `New broker registration — ${fullName}`,
    text: [
      "New broker registration received on the RMR Realty website.",
      "",
      `Name: ${fullName}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      agencyName ? `Agency: ${agencyName}` : null,
      "",
      `Registration ID: ${id}`,
    ]
      .filter(Boolean)
      .join("\n"),
  }).catch(() => {});
});
