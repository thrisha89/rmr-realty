import { verifyAccessToken } from "../lib/tokens.js";

function extractBearerToken(req) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) return null;
  return header.slice(7);
}

export function requireAuth(req, res, next) {
  const token = extractBearerToken(req);
  if (!token) return res.status(401).json({ error: "Not authenticated." });
  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    return res.status(401).json({ error: "Session expired. Please log in again." });
  }
}

export function requireAdmin(req, res, next) {
  const token = extractBearerToken(req);
  if (!token) return res.status(401).json({ error: "Not authenticated." });
  try {
    const payload = verifyAccessToken(token);
    if (payload.type !== "admin") {
      return res.status(403).json({ error: "Admin access required." });
    }
    req.admin = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Session expired. Please log in again." });
  }
}
