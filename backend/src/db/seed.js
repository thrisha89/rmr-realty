import "dotenv/config";
import bcrypt from "bcryptjs";
import { db, genId, runMigrations } from "./index.js";

// Every string below is taken directly from the client's requirements
// document and verified project references. Royal Encasa is a live project
// and uses the supplied project-specific content, media and video.

const AMENITIES = ["Club House", "Children's Park", "Overhead Tank", "CCTV", "Commercial Shops"];

function upsertAdmin() {
  const username = process.env.ADMIN_USERNAME || "ADMIN - RMR";
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    throw new Error(
      "ADMIN_PASSWORD is not set in .env — refusing to seed an admin without a real password."
    );
  }
  const passwordHash = bcrypt.hashSync(password, 10);
  const existing = db.prepare("SELECT id FROM AdminUser WHERE username = ?").get(username);
  if (existing) {
    db.prepare("UPDATE AdminUser SET passwordHash = ?, updatedAt = datetime('now') WHERE id = ?").run(
      passwordHash,
      existing.id
    );
  } else {
    db.prepare("INSERT INTO AdminUser (id, username, passwordHash, role) VALUES (?, ?, ?, 'admin')").run(
      genId("admin"),
      username,
      passwordHash
    );
  }
  console.log(`Admin account ready: ${username}`);
}

function upsertContentBlocks() {
  const blocks = [
    {
      key: "about_us_intro",
      label: "About Us — Intro",
      value:
        "RMR Realty began with a simple commitment: to treat every client's dream as our own. Searching for the right residential plot or commercial venue can feel overwhelming when faced with fragmented information and transactional sales approaches. We established RMR Realty to offer a warm, relationship-driven alternative — where genuine advice always comes before closing a deal.",
    },
    {
      key: "vision",
      label: "Vision",
      value:
        "To redefine the property buying experience by fostering absolute trust, legal transparency, and personal partnership — empowering every client to build their legacy on secure, value-backed land.",
    },
    {
      key: "mission",
      label: "Mission",
      value:
        "To build lasting trust within our community by guiding families and business owners toward secure, high-quality real estate assets with warmth, honesty, and unwavering support.",
    },
    {
      key: "short_description",
      label: "Short Description / Hero line",
      value: "High-growth corridors, seamless connectivity. Invest with confidence. Welcome to RMR.",
    },
  ];
  for (const b of blocks) {
    const existing = db.prepare("SELECT id FROM ContentBlock WHERE key = ?").get(b.key);
    if (!existing) {
      db.prepare("INSERT INTO ContentBlock (id, key, label, value) VALUES (?, ?, ?, ?)").run(
        genId("content"),
        b.key,
        b.label,
        b.value
      );
    }
  }
  console.log("Content blocks seeded.");
}

function upsertProject({
  slug,
  name,
  location,
  address,
  category,
  priceLabel,
  description,
  isVerified,
  sortOrder,
  mediaCount,
  mediaPrefix,
  amenities,
  videoUrl = null,
}) {
  const existing = db.prepare("SELECT id FROM Project WHERE slug = ?").get(slug);
  let projectId;
  if (existing) {
    projectId = existing.id;
    db.prepare(
      `UPDATE Project SET name=?, location=?, address=?, category=?, priceLabel=?, description=?, isVerified=?, videoUrl=COALESCE(?, videoUrl), sortOrder=?, updatedAt=datetime('now')
       WHERE id=?`
    ).run(name, location, address ?? null, category, priceLabel, description, isVerified ? 1 : 0, videoUrl, sortOrder, projectId);
  } else {
    projectId = genId("project");
    db.prepare(
      `INSERT INTO Project (id, slug, name, location, address, category, priceLabel, description, isVerified, videoUrl, sortOrder)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(projectId, slug, name, location, address ?? null, category, priceLabel, description, isVerified ? 1 : 0, videoUrl, sortOrder);
  }

  db.prepare("DELETE FROM ProjectMedia WHERE projectId = ?").run(projectId);
  const insertMedia = db.prepare(
    "INSERT INTO ProjectMedia (id, projectId, path, altText, sortOrder) VALUES (?, ?, ?, ?, ?)"
  );
  for (let i = 0; i < mediaCount; i++) {
    insertMedia.run(
      genId("media"),
      projectId,
      `/media/projects/${slug}/${mediaPrefix}-${String(i + 1).padStart(2, "0")}.jpg`,
      `${name} — site photo ${i + 1}`,
      i
    );
  }

  db.prepare("DELETE FROM ProjectAmenity WHERE projectId = ?").run(projectId);
  const insertAmenity = db.prepare(
    "INSERT INTO ProjectAmenity (id, projectId, label) VALUES (?, ?, ?)"
  );
  for (const label of amenities) {
    insertAmenity.run(genId("amenity"), projectId, label);
  }
}

function seedProjects() {
  upsertProject({
    slug: "geetha-garden",
    name: "Geetha Garden",
    location: "Nallur, Hosur",
    category: "Residential and Commercial Plots",
    priceLabel: "Starts from Rs. 3,899/- per sq ft*",
    description:
      "Geetha Garden is a residential and commercial plot development located in Nallur, Hosur, offered by RMR Realty. Loan assistance is available for eligible buyers.",
    isVerified: true,
    sortOrder: 1,
    mediaCount: 23,
    mediaPrefix: "geetha-garden",
    amenities: AMENITIES,
  });

  upsertProject({
    slug: "prestige-imperial",
    name: "Prestige Imperial",
    location: "Kalasthipuram, Bagalur Road",
    category: "Residential and Commercial Plots",
    priceLabel: "Starts from Rs. 3,899/- per sq ft*",
    description:
      "Prestige Imperial is a residential and commercial plot development located at Kalasthipuram, Bagalur Road, offered by RMR Realty. Loan assistance is available for eligible buyers.",
    isVerified: true,
    sortOrder: 2,
    mediaCount: 36,
    mediaPrefix: "prestige-imperial",
    amenities: AMENITIES,
  });

  upsertProject({
    slug: "royal-enclasa",
    name: "Royal Encasa",
    location: "Eluvapalli, Nallur",
    address: "RR3J+2M, Eluvapalli, Nallur, Tamil Nadu 635103",
    category: "Residential Plots",
    priceLabel: "₹3,999/sq.ft",
    description:
      "Royal Encasa is a premium gated residential plot development at Eluvapalli, Nallur, spread across approximately 10 acres. The project features HNTDA and RERA approvals, 183 premium plots, wide 30 ft and 40 ft roads, a children's park, landscaped avenues and essential infrastructure, with convenient access to key areas of Hosur and the surrounding growth corridor.",
    isVerified: true,
    sortOrder: 3,
    mediaCount: 23,
    mediaPrefix: "royal-enclasa",
    amenities: [
      "Grand Entrance Arch",
      "Club House",
      "Outdoor Gym",
      "Children's Park",
      "Elders Park",
      "30ft & 40ft Blacktop Roads",
      "Sewage Treatment Plant",
      "Overhead Tank & Water Line",
      "3-Phase Electricity",
      "Avenue Plantation",
    ],
    videoUrl: "/media/projects/royal-enclasa/re.mp4",
  });

  console.log("Projects seeded.");
}

runMigrations();
upsertAdmin();
upsertContentBlocks();
seedProjects();
console.log("Seed complete.");
