import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import rateLimit from "express-rate-limit";
import { db, genId } from "../db/index.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  REFRESH_COOKIE_NAME,
  ADMIN_REFRESH_COOKIE_NAME,
  refreshCookieOptions,
} from "../lib/tokens.js";
import { requireAuth } from "../middleware/auth.js";

export const authRouter = Router();

// Applied only to the genuinely abuse-prone, credential-guessing-adjacent
// endpoints (register / login / admin login). Session refresh, logout, and
// "/me" fire automatically on every page load for every visitor (logged in
// or not) as part of normal browsing, so they intentionally do NOT share
// this budget — otherwise ordinary navigation alone could exhaust the limit
// meant to stop credential-stuffing / spam-submission abuse, and lock a real
// visitor or admin out of logging in or submitting a form.
const credentialLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

const registerSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name."),
  email: z.string().trim().email("Please enter a valid email address."),
  phone: z
    .string()
    .trim()
    .min(10, "Please enter a valid phone number.")
    .max(15)
    .optional()
    .or(z.literal("")),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

// ---- Customer registration ----
authRouter.post("/register", credentialLimiter, async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }
  const { fullName, email, phone, password } = parsed.data;

  const existing = db.prepare("SELECT id FROM User WHERE email = ?").get(email);
  if (existing) {
    return res.status(409).json({ error: "An account with this email already exists." });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const id = genId("user");
  db.prepare(
    "INSERT INTO User (id, fullName, email, phone, passwordHash, status) VALUES (?, ?, ?, ?, ?, 'pending')"
  ).run(id, fullName, email, phone || null, passwordHash);

  // Account is created as Pending and cannot log in until an admin approves it.
  // No session/token is issued here — registration no longer auto-authenticates.
  res.status(201).json({
    status: "pending",
    message:
      "Your account has been created and is awaiting admin approval. You'll be able to log in once it's approved.",
  });
});

// ---- Customer login ----
authRouter.post("/login", credentialLimiter, async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Please enter a valid email and password." });
  }
  const { email, password } = parsed.data;

  const user = db.prepare("SELECT * FROM User WHERE email = ?").get(email);
  if (!user) return res.status(401).json({ error: "Invalid email or password." });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: "Invalid email or password." });

  // Enforced server-side: pending/rejected accounts cannot obtain a session,
  // regardless of what the frontend does or doesn't show.
  if (user.status === "pending") {
    return res.status(403).json({
      error: "Your account is awaiting admin approval. Please check back soon.",
      status: "pending",
    });
  }
  if (user.status === "rejected") {
    return res.status(403).json({
      error: "Your account registration was not approved. Please contact us for details.",
      status: "rejected",
    });
  }

  const accessToken = issueSession(res, { sub: user.id, type: "user" }, REFRESH_COOKIE_NAME);
  res.json({ user: publicUser(user), accessToken });
});

// ---- Admin login (separate, not linked from public nav) ----
authRouter.post("/admin/login", credentialLimiter, async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }

  const admin = db.prepare("SELECT * FROM AdminUser WHERE username = ?").get(username);
  if (!admin) return res.status(401).json({ error: "Invalid admin credentials." });

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) return res.status(401).json({ error: "Invalid admin credentials." });

  const accessToken = issueSession(
    res,
    { sub: admin.id, type: "admin", role: admin.role },
    ADMIN_REFRESH_COOKIE_NAME
  );
  res.json({ admin: { id: admin.id, username: admin.username, role: admin.role }, accessToken });
});

// ---- Refresh customer access token from httpOnly cookie ----
authRouter.post("/refresh", async (req, res) => {
  const token = req.cookies?.[REFRESH_COOKIE_NAME];
  if (!token) return res.status(401).json({ error: "Not authenticated." });
  try {
    const payload = verifyRefreshToken(token);
    const accessToken = signAccessToken({
      sub: payload.sub,
      type: payload.type,
      role: payload.role,
    });
    res.json({ accessToken });
  } catch {
    res.status(401).json({ error: "Session expired. Please log in again." });
  }
});

// ---- Refresh admin access token from its own httpOnly cookie ----
authRouter.post("/admin/refresh", async (req, res) => {
  const token = req.cookies?.[ADMIN_REFRESH_COOKIE_NAME];
  if (!token) return res.status(401).json({ error: "Not authenticated." });
  try {
    const payload = verifyRefreshToken(token);
    if (payload.type !== "admin") throw new Error("not admin");
    const accessToken = signAccessToken({ sub: payload.sub, type: "admin", role: payload.role });
    res.json({ accessToken });
  } catch {
    res.status(401).json({ error: "Session expired. Please log in again." });
  }
});

// ---- Logout ----
authRouter.post("/logout", (req, res) => {
  res.clearCookie(REFRESH_COOKIE_NAME, { path: "/api/auth" });
  res.json({ ok: true });
});

authRouter.post("/admin/logout", (req, res) => {
  res.clearCookie(ADMIN_REFRESH_COOKIE_NAME, { path: "/api/auth" });
  res.json({ ok: true });
});

// ---- Current customer profile ----
authRouter.get("/me", requireAuth, async (req, res) => {
  if (req.user.type !== "user") return res.status(403).json({ error: "Not a customer session." });
  const user = db.prepare("SELECT * FROM User WHERE id = ?").get(req.user.sub);
  if (!user) return res.status(404).json({ error: "Account not found." });
  res.json({ user: publicUser(user) });
});

function issueSession(res, payload, cookieName) {
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  res.cookie(cookieName, refreshToken, refreshCookieOptions("/api/auth"));
  return accessToken;
}

function publicUser(user) {
  return { id: user.id, fullName: user.fullName, email: user.email, phone: user.phone };
}
