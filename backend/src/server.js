const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { db, initDb, seedProducts } = require('./db');

const app = express();

// Enhanced CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

const PORT = process.env.PORT || 4000;
const MOCK_USER_ID = 'mock-user';
const MAX_CART_QUANTITY = parseInt(process.env.MAX_CART_QUANTITY) || 10;

initDb();
seedProducts();

// GET /api/products
app.get('/api/products', (req, res) => {
  db.all('SELECT id, name, price, image FROM products ORDER BY id', (err, rows) => {
    if (err) {
      console.error('Database error fetching products:', err);
      return res.status(500).json({ error: 'Failed to fetch products' });
    }
    res.json(rows);
  });
});

// POST /api/cart { productId, qty }
app.post('/api/cart', (req, res) => {
  const { productId, qty } = req.body || {};
  if (!productId || !qty || qty < 1 || qty > MAX_CART_QUANTITY) {
    return res.status(400).json({ 
      error: `productId and qty (1-${MAX_CART_QUANTITY}) are required` 
    });
  }

  // First verify product exists
  db.get('SELECT id FROM products WHERE id = ?', [productId], (pErr, product) => {
    if (pErr) {
      console.error('Database error checking product:', pErr);
      return res.status(500).json({ error: 'Failed to verify product' });
    }
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Upsert by (userId, productId)
    db.get(
      'SELECT id, qty FROM cart_items WHERE userId = ? AND productId = ?',
      [MOCK_USER_ID, productId],
      (err, row) => {
        if (err) {
          console.error('Database error accessing cart:', err);
          return res.status(500).json({ error: 'Failed to access cart' });
        }
        if (row) {
          const newQty = Math.min(row.qty + qty, MAX_CART_QUANTITY);
          db.run('UPDATE cart_items SET qty = ? WHERE id = ?', [newQty, row.id], function (uErr) {
            if (uErr) {
              console.error('Database error updating cart item:', uErr);
              return res.status(500).json({ error: 'Failed to update cart item' });
            }
            return getCart((cErr, cart) => {
              if (cErr) return res.status(500).json({ error: 'Failed to return cart' });
              res.json(cart);
            });
          });
        } else {
          db.run(
            'INSERT INTO cart_items (productId, qty, userId) VALUES (?, ?, ?)',
            [productId, qty, MOCK_USER_ID],
            function (iErr) {
              if (iErr) {
                console.error('Database error adding to cart:', iErr);
                return res.status(500).json({ error: 'Failed to add to cart' });
              }
              return getCart((cErr, cart) => {
                if (cErr) return res.status(500).json({ error: 'Failed to return cart' });
                res.json(cart);
              });
            }
          );
        }
      }
    );
  });
});

// DELETE /api/cart/:id
app.delete('/api/cart/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM cart_items WHERE id = ? AND userId = ?', [id, MOCK_USER_ID], function (err) {
    if (err) {
      console.error('Database error removing cart item:', err);
      return res.status(500).json({ error: 'Failed to remove item' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    return getCart((cErr, cart) => {
      if (cErr) return res.status(500).json({ error: 'Failed to return cart' });
      res.json(cart);
    });
  });
});

// PUT /api/cart/:id { qty }
app.put('/api/cart/:id', (req, res) => {
  const { id } = req.params;
  const { qty } = req.body || {};
  
  if (!qty || qty < 1 || qty > MAX_CART_QUANTITY) {
    return res.status(400).json({ 
      error: `qty must be between 1 and ${MAX_CART_QUANTITY}` 
    });
  }

  db.run('UPDATE cart_items SET qty = ? WHERE id = ? AND userId = ?', [qty, id, MOCK_USER_ID], function (err) {
    if (err) {
      console.error('Database error updating cart item:', err);
      return res.status(500).json({ error: 'Failed to update cart item' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    
    return getCart((cErr, cart) => {
      if (cErr) return res.status(500).json({ error: 'Failed to return cart' });
      res.json(cart);
    });
  });
});

// GET /api/cart
app.get('/api/cart', (req, res) => {
  getCart((err, cart) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch cart' });
    res.json(cart);
  });
});

// POST /api/checkout { name, email }
app.post('/api/checkout', (req, res) => {
  const { name, email } = req.body || {};
  
  // Enhanced validation
  if (!name || !email) {
    return res.status(400).json({ error: 'name and email are required' });
  }
  
  if (name.trim().length < 2) {
    return res.status(400).json({ error: 'Name must be at least 2 characters' });
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address' });
  }

  getCart((err, cart) => {
    if (err) {
      console.error('Database error getting cart for checkout:', err);
      return res.status(500).json({ error: 'Failed to get cart' });
    }
    
    if (!cart.items || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }
    
    // Generate a random order ID
    const orderId = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
    
    const receipt = {
      orderId,
      customerName: name.trim(),
      customerEmail: email.trim().toLowerCase(),
      items: cart.items,
      total: cart.total,
      orderDate: new Date().toISOString(),
      itemCount: cart.items.reduce((sum, item) => sum + item.qty, 0)
    };
    
    // Clear cart for mock user
    db.run('DELETE FROM cart_items WHERE userId = ?', [MOCK_USER_ID], function (dErr) {
      if (dErr) {
        console.error('Database error clearing cart:', dErr);
        return res.status(500).json({ error: 'Checkout succeeded, but failed to clear cart' });
      }
      console.log(`Checkout completed: Order ${orderId} for ${name}`);
      res.json(receipt);
    });
  });
});

function getCart(callback) {
  const query = `
    SELECT ci.id as id, ci.qty as qty, p.id as productId, p.name as name, p.price as price, p.image as image
    FROM cart_items ci
    JOIN products p ON p.id = ci.productId
    WHERE ci.userId = ?
  `;
  db.all(query, [MOCK_USER_ID], (err, rows) => {
    if (err) return callback(err);
    const items = rows.map((r) => ({
      id: r.id,
      productId: r.productId,
      name: r.name,
      price: r.price,
      image: r.image,
      qty: r.qty,
      lineTotal: Number((r.price * r.qty).toFixed(2))
    }));
    const total = Number(items.reduce((sum, i) => sum + i.lineTotal, 0).toFixed(2));
    callback(null, { items, total });
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler for unmatched routes (must be last)
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down gracefully...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});

// Start server with error handling
const server = app.listen(PORT, (err) => {
  if (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
  console.log(`🚀 API listening on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🛍️  Products API: http://localhost:${PORT}/api/products`);
  console.log(`🛒 Cart API: http://localhost:${PORT}/api/cart`);
  console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle server errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Please choose a different port.`);
  } else {
    console.error('❌ Server error:', err);
  }
  process.exit(1);
});


