const fs = require("fs");
const path = require("path");
const db = require("../config/db");

async function initDB() {
  try {
    const schemaPath = path.join(__dirname, "../../db/schema.sql");
    const sql = fs.readFileSync(schemaPath, "utf-8");

    const queries = sql
      .split(";")
      .map((q) => q.trim())
      .filter((q) => q.length);

    for (let query of queries) {
      await db.query(query); // ✅ use query NOT execute
    }

    console.log("✅ Database initialized");
  } catch (err) {
    console.error("❌ DB init failed:", err);
  }
}

module.exports = initDB;
