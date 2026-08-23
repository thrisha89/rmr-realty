import jwt from "jsonwebtoken";

const ACCESS_EXPIRY = "15m";
const REFRESH_EXPIRY = "7d";

export function signAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: ACCESS_EXPIRY });
}

export function signRefreshToken(payload) {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: REFRESH_EXPIRY });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
}

export const REFRESH_COOKIE_NAME = "rmr_refresh";
export const ADMIN_REFRESH_COOKIE_NAME = "rmr_admin_refresh";

export function refreshCookieOptions(path = "/api/auth") {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}
