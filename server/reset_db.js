// 🌿 GreenVada – Reset & Recreate Database from init_db.sql
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

const dbFile = path.join(__dirname, "greenvada.db");
const sqlFile = path.join(__dirname, "init_db.sql");

// Read SQL script
const sql = fs.readFileSync(sqlFile, "utf8");

// Create or overwrite DB
const db = new sqlite3.Database(dbFile, (err) => {
  if (err) return console.error("❌ Error opening DB:", err.message);
  console.log("✅ Connected to SQLite:", dbFile);
});

// Execute SQL
db.exec(sql, (err) => {
  if (err) console.error("❌ Error executing SQL:", err.message);
  else console.log("✅ Database recreated successfully from init_db.sql");
  db.close();
});
