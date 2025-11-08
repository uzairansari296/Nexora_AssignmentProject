// Utility functions for the frontend application
import { UI_MESSAGES } from '../constants';

/**
 * Format currency amount
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency symbol
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount, currency = '$') => {
  if (typeof amount !== 'number' || isNaN(amount)) return `${currency}0.00`;
  return `${currency}${Number(amount).toFixed(2)}`;
};

/**
 * Calculate cart total and item count
 * @param {Array} items - Cart items array
 * @returns {Object} - Cart statistics
 */
export const calculateCartStats = (items = []) => {
  const itemCount = items.reduce((sum, item) => sum + (item.qty || 0), 0);
  const total = items.reduce((sum, item) => {
    const lineTotal = (item.price || 0) * (item.qty || 0);
    return sum + lineTotal;
  }, 0);
  
  return {
    itemCount,
    total: Number(total.toFixed(2)),
    isEmpty: items.length === 0
  };
};

/**
 * Debounce function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Create error message from different error types
 * @param {Error|string} error - Error object or string
 * @returns {string} - User-friendly error message
 */
export const createErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  
  if (error?.message) {
    // Handle specific error messages
    if (error.message.includes('timeout')) return UI_MESSAGES.ERRORS.TIMEOUT;
    if (error.message.includes('network') || error.message.includes('connect')) {
      return UI_MESSAGES.ERRORS.NETWORK;
    }
    return error.message;
  }
  
  return UI_MESSAGES.ERRORS.GENERIC;
};

/**
 * Generate unique order ID for receipts
 * @returns {string} - Unique order ID
 */
export const generateOrderId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 5).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate form data for checkout
 * @param {Object} formData - Form data to validate
 * @returns {Object} - Validation result with errors
 */
export const validateCheckoutForm = (formData) => {
  const errors = {};
  
  if (!formData.name?.trim()) {
    errors.name = 'Name is required';
  } else if (formData.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }
  
  if (!formData.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Create localStorage helper with error handling
 * @param {string} key - Storage key
 * @returns {Object} - Storage helper methods
 */
export const createStorageHelper = (key) => {
  return {
    get: () => {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (error) {
        console.warn('Failed to read from localStorage:', error);
        return null;
      }
    },
    
    set: (value) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (error) {
        console.warn('Failed to write to localStorage:', error);
        return false;
      }
    },
    
    remove: () => {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (error) {
        console.warn('Failed to remove from localStorage:', error);
        return false;
      }
    }
  };
};

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @param {Object} options - Formatting options
 * @returns {string} - Formatted date string
 */
export const formatDate = (date, options = {}) => {
  try {
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      ...options
    };
    
    return new Date(date).toLocaleDateString('en-US', defaultOptions);
  } catch {
    return 'Invalid Date';
  }
};

/**
 * Create retry function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum retry attempts
 * @param {number} baseDelay - Base delay in milliseconds
 * @returns {Function} - Function with retry capability
 */
export const withRetry = (fn, maxRetries = 3, baseDelay = 1000) => {
  return async (...args) => {
    let lastError;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn(...args);
      } catch (error) {
        lastError = error;
        
        if (attempt === maxRetries) break;
        
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError;
  };
};