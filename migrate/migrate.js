// migrate/migrate.js
import fs from "fs";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

// --- Connect to MongoDB ---
const mongo = new MongoClient(process.env.MONGO_URI);
await mongo.connect();
const db = mongo.db("soundfx");
console.log("🚀 Connected to MongoDB Atlas");

// --- Load JSON data ---
const raw = fs.readFileSync("./migrate/sep.json", "utf8");
const data = JSON.parse(raw);
console.log("📦 Loaded sep.json data");

// --- Step 1: Transform & Insert Users ---
async function migrateUsers() {
  const table = data.find(t => t.name === "user");
  if (!table || !table.data) {
    console.log("⚠️ No users table found.");
    return;
  }

  // Collect uids from files and favorites
  const fileUids = new Set((data.find(t => t.name === "files")?.data || []).map(f => f.user));
  const favUids = new Set((data.find(t => t.name === "fav")?.data || []).map(f => f.user));
  const validUids = new Set([...fileUids, ...favUids]);

  const users = table.data
    .filter(u => validUids.has(u.uid))
    .map(u => ({
      uid: u.uid,
      name: u.name?.trim() || null,
      first_name: u.first_name?.trim() || null,
      last_name: u.last_name?.trim() || null,
      email: u.email?.toLowerCase() || null,
      picture: u.picture || null,
      oauth: u.oauth_provider
        ? { provider: u.oauth_provider, uid: u.oauth_uid }
        : null,
      employee: !!Number(u.employee),
      block: !!Number(u.block),
      modifiedAt: u.modified ? new Date(u.modified) : null
    }));

  await db.collection("users").deleteMany({});
  await db.collection("users").insertMany(users);
  console.log("✅ Users cleaned & migrated:", users.length);
}

// --- Step 2: Transform & Insert Categories ---
async function migrateCategories() {
  const table = data.find(t => t.name === "category");
  if (!table || !table.data) {
    console.log("⚠️ No category table found.");
    return;
  }

  const categories = table.data.map(c => ({
    id: c.id,
    name: c.name?.trim() || null,
    slug: c.slug?.trim() || null,
    thumb: c.thumb || null
  }));

  await db.collection("categories").deleteMany({});
  await db.collection("categories").insertMany(categories);
  console.log("✅ Categories cleaned & migrated:", categories.length);
}

// --- Step 3: Transform & Insert Files ---
async function migrateFiles() {
  const table = data.find(t => t.name === "files");
  if (!table || !table.data) {
    console.log("⚠️ No files table found.");
    return;
  }

  const files = table.data.map(f => ({
    s_id: f.s_id,
    title: f.title?.trim() || null,
    slug: f.url?.trim() || null,
    duration: f.duration || null,
    tags: f.tags ? f.tags.split(",").map(t => t.trim()) : [],
    views: Number(f.views) || 0,
    downloads: Number(f.dloads) || 0,
    uploader_uid: f.user || null,
    category: f.temp_cat || null,
    reports: 0,
    createdAt: f.add_date ? new Date(f.add_date) : null
  }));

  await db.collection("files").deleteMany({});
  await db.collection("files").insertMany(files);
  console.log("✅ Files cleaned & migrated:", files.length);
}

// --- Step 4: Transform & Insert Favorites ---
async function migrateFavs() {
  const table = data.find(t => t.name === "fav");
  if (!table || !table.data) {
    console.log("⚠️ No fav table found.");
    return;
  }

  const favs = table.data.map(f => ({
    id: Number(f.id),
    file_sid: f.s_id,
    user_uid: f.user
  }));

  await db.collection("favorites").deleteMany({});
  await db.collection("favorites").insertMany(favs);
  console.log("✅ Favorites cleaned & migrated:", favs.length);
}

// --- Step 5: Create Indexes for Scalability ---
async function createIndexes() {
  await db.collection("users").createIndex({ uid: 1 }, { unique: true });
  await db.collection("files").createIndex({ s_id: 1 }, { unique: true });
  await db.collection("favorites").createIndex(
    { user_uid: 1, file_sid: 1 },
    { unique: true }
  );
  await db.collection("categories").createIndex({ slug: 1 }, { unique: true });
  console.log("🔍 Indexes created for scalability");
}

// --- Step 6: Run Migration ---
try {
  await migrateUsers();
  await migrateCategories();
  await migrateFiles();
  await migrateFavs();
  await createIndexes();
  console.log("🎉 Migration complete!");
} catch (err) {
  console.error("❌ Migration failed:", err);
} finally {
  await mongo.close();
}
