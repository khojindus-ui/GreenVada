-- 🌿 GreenVada Database Initialization

DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS order_items;

-- 🛍️ Products table
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  image TEXT
);

-- 📦 Orders table
CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT,
  total REAL,
  status TEXT DEFAULT 'pending',
  createdAt TEXT DEFAULT (datetime('now', 'localtime'))
);

-- 🧾 Order items table
CREATE TABLE order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER,
  title TEXT,
  qty INTEGER,
  price REAL,
  FOREIGN KEY(order_id) REFERENCES orders(id)
);

-- 🌱 Seed Products
INSERT INTO products (name, description, price, image) VALUES
('Organic Herbal Tea', 'A soothing blend of herbs for daily detox.', 299, 'https://cdn-icons-png.flaticon.com/512/706/706164.png'),
('Ayurvedic Capsules', 'Natural energy and immunity booster.', 499, 'https://cdn-icons-png.flaticon.com/512/2965/2965567.png'),
('Neem Face Pack', 'Herbal skin care for acne and glow.', 199, 'https://cdn-icons-png.flaticon.com/512/2965/2965549.png'),
('Tulsi Drops', 'Powerful antioxidant immunity drops.', 349, 'https://cdn-icons-png.flaticon.com/512/2965/2965547.png');
