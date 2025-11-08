/**
 * Fake Store API integration example
 * Add this to your backend to fetch products from external API
 */

const axios = require('axios');

const FAKE_STORE_API = 'https://fakestoreapi.com/products';

// Enhanced product seeding with Fake Store API
async function seedProductsFromAPI() {
  try {
    console.log('Fetching products from Fake Store API...');
    const response = await axios.get(FAKE_STORE_API);
    const apiProducts = response.data.slice(0, 6); // Take first 6 products
    
    // Transform API data to match your schema
    const products = apiProducts.map(product => ({
      id: product.id,
      name: product.title,
      price: product.price,
      image: product.image
    }));

    // Check if products already exist
    db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
      if (err) {
        console.error('Error checking product count:', err);
        return;
      }
      
      if (row && row.count === 0) {
        console.log('Seeding products from Fake Store API...');
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
            console.log(`✅ Seeded ${products.length} products from Fake Store API`);
          }
        });
      } else {
        console.log('Products already exist, skipping API fetch');
      }
    });
    
  } catch (error) {
    console.error('Failed to fetch from Fake Store API, using fallback data:', error);
    // Fall back to your existing seedProducts() function
    seedProducts();
  }
}

module.exports = { seedProductsFromAPI };