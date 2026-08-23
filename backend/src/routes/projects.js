import { Router } from "express";
import { db } from "../db/index.js";

export const projectsRouter = Router();

const SUPPORTED_LANGS = new Set(["en", "kn", "ta", "te"]);

function attachRelations(project, lang) {
  const media = db
    .prepare("SELECT * FROM ProjectMedia WHERE projectId = ? ORDER BY sortOrder ASC")
    .all(project.id);
  let amenities = db
    .prepare("SELECT * FROM ProjectAmenity WHERE projectId = ?")
    .all(project.id);

  let translated = { ...project };
  if (lang && lang !== "en") {
    const override = db
      .prepare("SELECT * FROM ProjectTranslation WHERE projectId = ? AND lang = ?")
      .get(project.id, lang);
    if (override) {
      translated = {
        ...translated,
        category: override.category || translated.category,
        priceLabel: override.priceLabel || translated.priceLabel,
        description: override.description || translated.description,
      };
    }
    amenities = amenities.map((a) => {
      const t = db
        .prepare("SELECT translated FROM AmenityTranslation WHERE label = ? AND lang = ?")
        .get(a.label, lang);
      return t ? { ...a, label: t.translated } : a;
    });
  }

  return { ...translated, isVerified: Boolean(project.isVerified), media, amenities };
}

function resolveLang(req) {
  return SUPPORTED_LANGS.has(req.query.lang) ? req.query.lang : "en";
}

projectsRouter.get("/", (req, res) => {
  const lang = resolveLang(req);
  const projects = db.prepare("SELECT * FROM Project ORDER BY sortOrder ASC").all();
  res.json({ projects: projects.map((p) => attachRelations(p, lang)) });
});

projectsRouter.get("/:slug", (req, res) => {
  const lang = resolveLang(req);
  const project = db.prepare("SELECT * FROM Project WHERE slug = ?").get(req.params.slug);
  if (!project) return res.status(404).json({ error: "Project not found." });
  res.json({ project: attachRelations(project, lang) });
});
