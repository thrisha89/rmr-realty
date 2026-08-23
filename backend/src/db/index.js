import "dotenv/config";
import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function resolveDbPath() {
  const raw = process.env.DATABASE_URL || "file:./data/dev.db";
  const filePath = raw.replace(/^file:/, "");
  return path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);
}

const dbPath = resolveDbPath();
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

export const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

export function runMigrations() {
  const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf-8");
  db.exec(schema);

  // CREATE TABLE IF NOT EXISTS won't add new columns to an already-existing
  // table, so handle simple additive column migrations here.
  const projectColumns = db.prepare("PRAGMA table_info(Project)").all().map((c) => c.name);
  if (!projectColumns.includes("address")) {
    db.exec("ALTER TABLE Project ADD COLUMN address TEXT");
  }

  // User approval workflow — additive columns for pre-existing databases.
  const userColumns = db.prepare("PRAGMA table_info(User)").all().map((c) => c.name);
  if (!userColumns.includes("status")) {
    // Existing users (registered before this feature) are grandfathered in as approved
    // so nobody who could already log in gets locked out by this migration.
    db.exec("ALTER TABLE User ADD COLUMN status TEXT NOT NULL DEFAULT 'approved'");
  }
  if (!userColumns.includes("reviewedAt")) {
    db.exec("ALTER TABLE User ADD COLUMN reviewedAt TEXT");
  }
  if (!userColumns.includes("reviewedBy")) {
    db.exec("ALTER TABLE User ADD COLUMN reviewedBy TEXT");
  }
}

export function genId(prefix = "") {
  const uuid = crypto.randomUUID().replace(/-/g, "");
  return prefix ? `${prefix}_${uuid}` : uuid;
}
