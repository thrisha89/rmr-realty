// Zero-cost email notifications via SMTP (nodemailer is free/open-source;
// no paid email API is used). Works with any SMTP provider, including a
// free Gmail account using an "App Password" (Google Account → Security →
// 2-Step Verification → App passwords). See backend/.env.example for the
// exact variables to set.
//
// IMPORTANT: this module is fully optional at runtime. If SMTP_USER /
// SMTP_PASS are not configured, sendNotificationEmail() simply logs a
// warning and resolves — it never throws, and it never blocks a form
// submission from being saved to the database. This means leads/brokers
// keep working end-to-end even before real email credentials are added.

import nodemailer from "nodemailer";

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_SECURE,
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM,
  NOTIFY_TO,
} = process.env;

const isConfigured = Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS);

let transporter = null;
function getTransporter() {
  if (!isConfigured) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 587,
      secure: SMTP_SECURE === "true", // true for port 465, false for 587/STARTTLS
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }
  return transporter;
}

let warned = false;

/**
 * Fire-and-forget email notification. Never throws — callers should not
 * await this in a way that blocks the HTTP response; call it and let it
 * resolve in the background.
 */
export async function sendNotificationEmail({ subject, text, html }) {
  const t = getTransporter();
  if (!t) {
    if (!warned) {
      console.warn(
        "[mailer] SMTP_HOST/SMTP_USER/SMTP_PASS not set — skipping email notification. " +
          "See backend/.env.example to enable real emails (free with a Gmail App Password)."
      );
      warned = true;
    }
    return { sent: false, reason: "not_configured" };
  }

  const to = NOTIFY_TO || SMTP_USER;
  try {
    await t.sendMail({
      from: SMTP_FROM || SMTP_USER,
      to,
      subject,
      text,
      html,
    });
    return { sent: true };
  } catch (err) {
    console.error("[mailer] Failed to send notification email:", err.message);
    return { sent: false, reason: "send_failed" };
  }
}
