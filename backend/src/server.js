import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import { runMigrations } from "./db/index.js";
import { authRouter } from "./routes/auth.js";
import { projectsRouter } from "./routes/projects.js";
import { leadsRouter } from "./routes/leads.js";
import { brokersRouter } from "./routes/brokers.js";
import { chatbotRouter } from "./routes/chatbot.js";
import { contentRouter } from "./routes/content.js";
import { adminRouter } from "./routes/admin.js";
import { myEnquiriesRouter } from "./routes/myEnquiries.js";
import { trackingRouter } from "./routes/tracking.js";

runMigrations();

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// Rate limit form-submission endpoints (leads, brokers) to reduce spam abuse.
// Login/register/admin-login have their own dedicated limiter in auth.js —
// they used to share this one, but this budget is now reserved for actual
// submission endpoints since session-refresh calls (which fire on every
// page load) must not compete with it. See credentialLimiter in auth.js.
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

// Page views / search tracking happen far more often than form submits,
// so they get a much higher (but still bounded) rate limit to prevent abuse.
const trackingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 600,
  standardHeaders: true,
  legacyHeaders: false,
});

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRouter);
app.use("/api/leads", strictLimiter, leadsRouter);
app.use("/api/brokers", strictLimiter, brokersRouter);
app.use("/api/chatbot", chatbotRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/content", contentRouter);
app.use("/api/my-enquiries", myEnquiriesRouter);
app.use("/api/tracking", trackingLimiter, trackingRouter);
app.use("/api/admin", adminRouter);

// Central error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong. Please try again." });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`RMR Realty API listening on http://localhost:${port}`);
});
