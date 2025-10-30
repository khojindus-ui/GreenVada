const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const sqlFile = path.join(__dirname, 'init_db.sql');
if (!fs.existsSync(sqlFile)) {
  console.error('init_db.sql not found in server folder.');
  process.exit(1);
}
const sql = fs.readFileSync(sqlFile, 'utf8');

const dbPath = path.join(__dirname,'greenvada.db');
const db = new sqlite3.Database(dbPath);

db.exec(sql, (err) => {
  if (err) {
    console.error('❌ Database initialization failed:', err.message);
    process.exit(1);
  } else {
    console.log('✅ Database initialized successfully!');
    db.close();
    process.exit(0);
  }
});
