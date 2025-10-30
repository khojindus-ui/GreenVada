// 🌿 GreenVada API Backend – Render + Local Compatible
const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();

// -----------------------------
// 🌐 Middleware
// -----------------------------
app.use(cors());
app.use(express.json());

// -----------------------------
// 💾 Database Connection
// -----------------------------
const DB_PATH = path.join(__dirname, "greenvada.db");
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) console.error("❌ Database connection failed:", err.message);
  else console.log("✅ Connected to SQLite database:", DB_PATH);
});

// ===========================
// 🛍️ PRODUCTS
// ===========================
app.get("/api/products", (req, res) => {
  db.all("SELECT * FROM products", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post("/api/products", (req, res) => {
  const { name, description, price, image } = req.body;
  const sql = "INSERT INTO products (name, description, price, image) VALUES (?, ?, ?, ?)";
  db.run(sql, [name, description, price, image], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

app.put("/api/products/:id", (req, res) => {
  const { name, description, price, image } = req.body;
  db.run(
    "UPDATE products SET name=?, description=?, price=?, image=? WHERE id=?",
    [name, description, price, image, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});

app.delete("/api/products/:id", (req, res) => {
  db.run("DELETE FROM products WHERE id=?", req.params.id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// ===========================
// 📦 ORDERS
// ===========================

// Get all orders with items
app.get("/api/orders", (req, res) => {
  db.all("SELECT * FROM orders ORDER BY id DESC", [], async (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const orders = [];
    for (const o of rows) {
      const items = await new Promise((resolve, reject) => {
        db.all("SELECT * FROM order_items WHERE order_id=?", [o.id], (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });
      orders.push({ ...o, items });
    }

    res.json(orders);
  });
});

// Create new order
app.post("/api/orders", (req, res) => {
  const o = req.body;
  const date = new Date().toISOString();

  db.run(
    "INSERT INTO orders (username, total, status, createdAt) VALUES (?, ?, ?, ?)",
    [o.username, o.total, o.status || "pending", date],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      const orderId = this.lastID;
      const stmt = db.prepare("INSERT INTO order_items (order_id, title, qty, price) VALUES (?, ?, ?, ?)");
      o.items.forEach((i) => stmt.run(orderId, i.title, i.qty, i.price));
      stmt.finalize();
      res.json({ ok: true, id: orderId });
    }
  );
});

// Update order status
app.put("/api/orders/:id", (req, res) => {
  const { status } = req.body;
  db.run("UPDATE orders SET status=? WHERE id=?", [status, req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ updated: this.changes });
  });
});

// ===========================
// 🌐 HEALTH CHECK
// ===========================
app.get("/", (req, res) => {
  res.send("🌿 GreenVada API is live! Endpoints: /api/products & /api/orders");
});

// ===========================
// 🚀 Render Port Fix
// ===========================
const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server running on port ${PORT}`));
