import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

// Configure axios defaults
const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Response Error:', error);
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please check your connection.');
    }
    
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || error.response.data?.error || 'Server error occurred';
      throw new Error(message);
    } else if (error.request) {
      // Request made but no response received
      throw new Error('Unable to connect to server. Please check your connection.');
    } else {
      // Something else happened
      throw new Error('An unexpected error occurred');
    }
  }
);

export async function fetchProducts() {
  try {
    const response = await api.get('/api/products');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    throw error;
  }
}

export async function fetchCart() {
  try {
    const response = await api.get('/api/cart');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch cart:', error);
    throw error;
  }
}

export async function addToCart(productId, qty = 1) {
  try {
    const response = await api.post('/api/cart', { productId, qty });
    return response.data;
  } catch (error) {
    console.error('Failed to add to cart:', error);
    throw error;
  }
}

export async function removeCartItem(id) {
  try {
    const response = await api.delete(`/api/cart/${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to remove cart item:', error);
    throw error;
  }
}

export async function updateCartItem(id, qty) {
  try {
    const response = await api.put(`/api/cart/${id}`, { qty });
    return response.data;
  } catch (error) {
    console.error('Failed to update cart item:', error);
    throw error;
  }
}

export async function checkout(name, email) {
  try {
    const response = await api.post('/api/checkout', { name, email });
    return response.data;
  } catch (error) {
    console.error('Failed to checkout:', error);
    throw error;
  }
}


