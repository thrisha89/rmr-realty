-- RMR Realty — database schema (SQLite)
-- Run automatically on server start (idempotent) and via `npm run db:migrate`.
-- Zero-cost local setup. Can be pointed at any SQLite-compatible file path
-- via DATABASE_URL in .env.

CREATE TABLE IF NOT EXISTS AdminUser (
  id           TEXT PRIMARY KEY,
  username     TEXT UNIQUE NOT NULL,
  passwordHash TEXT NOT NULL,
  role         TEXT NOT NULL DEFAULT 'admin',
  createdAt    TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS User (
  id           TEXT PRIMARY KEY,
  fullName     TEXT NOT NULL,
  email        TEXT UNIQUE NOT NULL,
  phone        TEXT,
  passwordHash TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'pending', -- pending | approved | rejected
  reviewedAt   TEXT,
  reviewedBy   TEXT,
  createdAt    TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS Project (
  id          TEXT PRIMARY KEY,
  slug        TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  location    TEXT,
  address     TEXT,
  category    TEXT,
  priceLabel  TEXT,
  description TEXT,
  isVerified  INTEGER NOT NULL DEFAULT 0,
  videoUrl    TEXT,
  sortOrder   INTEGER NOT NULL DEFAULT 0,
  createdAt   TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS ProjectMedia (
  id        TEXT PRIMARY KEY,
  projectId TEXT NOT NULL REFERENCES Project(id) ON DELETE CASCADE,
  path      TEXT NOT NULL,
  altText   TEXT NOT NULL,
  sortOrder INTEGER NOT NULL DEFAULT 0,
  createdAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS ProjectAmenity (
  id        TEXT PRIMARY KEY,
  projectId TEXT NOT NULL REFERENCES Project(id) ON DELETE CASCADE,
  label     TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Lead (
  id        TEXT PRIMARY KEY,
  name      TEXT NOT NULL,
  email     TEXT NOT NULL,
  phone     TEXT NOT NULL,
  message   TEXT,
  source    TEXT NOT NULL,
  projectId TEXT REFERENCES Project(id),
  userId    TEXT REFERENCES User(id),
  status    TEXT NOT NULL DEFAULT 'new',
  createdAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS BrokerRegistration (
  id         TEXT PRIMARY KEY,
  fullName   TEXT NOT NULL,
  phone      TEXT NOT NULL,
  email      TEXT NOT NULL,
  agencyName TEXT,
  status     TEXT NOT NULL DEFAULT 'new',
  createdAt  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS ChatbotConversation (
  id        TEXT PRIMARY KEY,
  visitorId TEXT NOT NULL,
  createdAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS ChatbotMessage (
  id             TEXT PRIMARY KEY,
  conversationId TEXT NOT NULL REFERENCES ChatbotConversation(id) ON DELETE CASCADE,
  role           TEXT NOT NULL,
  content        TEXT NOT NULL,
  matchedIntent  TEXT,
  createdAt      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS ContentBlock (
  id        TEXT PRIMARY KEY,
  key       TEXT UNIQUE NOT NULL,
  label     TEXT NOT NULL,
  value     TEXT NOT NULL,
  updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Anonymous page-view tracking. One row per page load. No personal data —
-- visitorId is a random id generated client-side and stored in localStorage.
CREATE TABLE IF NOT EXISTS PageView (
  id        TEXT PRIMARY KEY,
  path      TEXT NOT NULL,
  referrer  TEXT,
  visitorId TEXT,
  userAgent TEXT,
  createdAt TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Search/query activity (e.g. the Projects page search box).
CREATE TABLE IF NOT EXISTS SearchQuery (
  id            TEXT PRIMARY KEY,
  query         TEXT NOT NULL,
  resultsCount  INTEGER,
  visitorId     TEXT,
  createdAt     TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_lead_project ON Lead(projectId);
CREATE INDEX IF NOT EXISTS idx_lead_user ON Lead(userId);
CREATE INDEX IF NOT EXISTS idx_media_project ON ProjectMedia(projectId);
CREATE INDEX IF NOT EXISTS idx_amenity_project ON ProjectAmenity(projectId);
CREATE INDEX IF NOT EXISTS idx_message_conversation ON ChatbotMessage(conversationId);
CREATE INDEX IF NOT EXISTS idx_pageview_path ON PageView(path);
CREATE INDEX IF NOT EXISTS idx_pageview_created ON PageView(createdAt);
CREATE INDEX IF NOT EXISTS idx_search_created ON SearchQuery(createdAt);

-- Optional per-language overlay for translatable Project fields (category,
-- priceLabel, description). Rows only exist for languages that have a
-- translation; missing rows simply fall back to the base (English) Project
-- row, so this is purely additive and does not change existing Project data
-- or the existing admin project editor.
CREATE TABLE IF NOT EXISTS ProjectTranslation (
  id          TEXT PRIMARY KEY,
  projectId   TEXT NOT NULL REFERENCES Project(id) ON DELETE CASCADE,
  lang        TEXT NOT NULL,
  category    TEXT,
  priceLabel  TEXT,
  description TEXT,
  createdAt   TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt   TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (projectId, lang)
);

-- Optional per-language overlay for amenity labels. Keyed by the original
-- (English) label text rather than amenity id, so one translation covers the
-- same amenity label wherever it's reused across multiple projects.
CREATE TABLE IF NOT EXISTS AmenityTranslation (
  id         TEXT PRIMARY KEY,
  label      TEXT NOT NULL,
  lang       TEXT NOT NULL,
  translated TEXT NOT NULL,
  UNIQUE (label, lang)
);
