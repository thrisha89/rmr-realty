import { Router } from "express";
import { db } from "../db/index.js";

export const contentRouter = Router();

const SUPPORTED_LANGS = new Set(["en", "kn", "ta", "te"]);

// Content blocks are stored with a base (English) key, e.g. "short_description",
// edited via the existing Admin Panel content editor exactly as before.
// Translated variants are optionally stored under "<key>__<lang>" (e.g.
// "short_description__kn"). When a visitor requests a non-English language,
// this endpoint transparently overlays any translated variants on top of the
// base content, falling back to the base (English) value when no translation
// exists for that key. This preserves the existing single-table architecture
// and the existing admin editing UI without any schema migration.
contentRouter.get("/", (req, res) => {
  const blocks = db.prepare("SELECT * FROM ContentBlock").all();
  const lang = SUPPORTED_LANGS.has(req.query.lang) ? req.query.lang : "en";

  const base = {};
  const overrides = {};
  for (const b of blocks) {
    const match = b.key.match(/^(.*)__(kn|ta|te)$/);
    if (match) {
      const [, baseKey, blockLang] = match;
      if (blockLang === lang) overrides[baseKey] = b.value;
    } else {
      base[b.key] = b.value;
    }
  }

  const map = { ...base, ...overrides };
  res.json({ content: map });
});
