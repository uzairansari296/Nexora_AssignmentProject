const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbFile = process.env.DATABASE_URL || path.join(__dirname, '..', 'data.db');

const db = new sqlite3.Database(dbFile);

function initDb() {
  db.serialize(() => {
    // Enable foreign keys
    db.run('PRAGMA foreign_keys = ON');
    
    db.run(
      `CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        price REAL NOT NULL CHECK(price > 0),
        image TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`
    );

    db.run(
      `CREATE TABLE IF NOT EXISTS cart_items (
        id INTEGER PRIMARY KEY,
        productId INTEGER NOT NULL,
        qty INTEGER NOT NULL CHECK(qty > 0 AND qty <= 10),
        userId TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(productId) REFERENCES products(id) ON DELETE CASCADE
      )`
    );

    // Create indexes for better performance
    db.run('CREATE INDEX IF NOT EXISTS idx_cart_user_product ON cart_items(userId, productId)');
    db.run('CREATE INDEX IF NOT EXISTS idx_cart_user ON cart_items(userId)');
  });
}

function seedProducts() {
  const products = [
    { id: 1, name: 'Vibe Tee', price: 19.99, image: '/images/products/product-1.svg' },
    { id: 2, name: 'Vibe Hoodie', price: 49.99, image: '/images/products/product-2.svg' },
    { id: 3, name: 'Vibe Cap', price: 14.99, image: '/images/products/product-3.svg' },
    { id: 4, name: 'Vibe Socks', price: 9.99, image: '/images/products/product-4.svg' },
  ];

  db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
    if (err) {
      console.error('Error checking product count:', err);
      return;
    }
    if (row && row.count === 0) {
      console.log('Seeding products...');
      const stmt = db.prepare('INSERT INTO products (id, name, price, image) VALUES (?, ?, ?, ?)');
      products.forEach((p) => {
        stmt.run(p.id, p.name, p.price, p.image, (err) => {
          if (err) console.error(`Error seeding product ${p.name}:`, err);
        });
      });
      stmt.finalize((err) => {
        if (err) {
          console.error('Error finalizing product seeding:', err);
        } else {
          console.log(`✅ Seeded ${products.length} products successfully`);
        }
      });
    }
  });
}

module.exports = { db, initDb, seedProducts };


