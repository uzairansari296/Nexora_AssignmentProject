// Application constants and configuration
export const APP_CONFIG = {
  API_BASE: import.meta.env.VITE_API_BASE || 'http://localhost:4000',
  APP_NAME: 'Vibe Commerce',
  MAX_CART_QUANTITY: 10,
  CURRENCY: '$',
  TIMEOUT: 10000
};

export const ROUTES = {
  HOME: '/',
  CART: '/cart',
  CHECKOUT: '/checkout',
  RECEIPT: '/receipt'
};

export const API_ENDPOINTS = {
  PRODUCTS: '/api/products',
  CART: '/api/cart',
  CHECKOUT: '/api/checkout',
  HEALTH: '/health'
};

export const BREAKPOINTS = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536
};

export const THEME_COLORS = {
  primary: '#1976d2',
  secondary: '#dc004e',
  success: '#2e7d32',
  error: '#d32f2f',
  warning: '#ed6c02',
  info: '#0288d1'
};

export const UI_MESSAGES = {
  LOADING: {
    PRODUCTS: 'Loading products...',
    CART: 'Loading cart...',
    APP: 'Loading Vibe Commerce...',
    CHECKOUT: 'Processing checkout...'
  },
  ERRORS: {
    PRODUCTS_LOAD: 'Failed to load products. Please try again.',
    CART_ADD: 'Failed to add item to cart',
    CART_REMOVE: 'Failed to remove item from cart',
    CART_UPDATE: 'Failed to update item quantity',
    CHECKOUT: 'Checkout failed. Please try again.',
    NETWORK: 'Unable to connect to server. Please check your connection.',
    TIMEOUT: 'Request timeout. Please check your connection.',
    GENERIC: 'An unexpected error occurred'
  },
  SUCCESS: {
    ITEM_ADDED: 'Item added to cart',
    ITEM_REMOVED: 'Item removed from cart',
    CHECKOUT_SUCCESS: 'Order placed successfully!'
  }
};