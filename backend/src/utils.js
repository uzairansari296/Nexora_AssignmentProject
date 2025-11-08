/**
 * Utility functions for the backend
 */

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitize user input
 * @param {string} input - Input to sanitize
 * @returns {string} - Sanitized input
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>]/g, '');
}

/**
 * Generate unique order ID
 * @returns {string} - Unique order ID
 */
function generateOrderId() {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substr(2, 5).toUpperCase();
  return `ORD-${timestamp}-${randomString}`;
}

/**
 * Format currency amount
 * @param {number} amount - Amount to format
 * @returns {number} - Formatted amount with 2 decimals
 */
function formatCurrency(amount) {
  return Number(parseFloat(amount).toFixed(2));
}

/**
 * Validate quantity
 * @param {number} qty - Quantity to validate
 * @param {number} max - Maximum allowed quantity
 * @returns {boolean} - True if valid quantity
 */
function isValidQuantity(qty, max = 10) {
  return Number.isInteger(qty) && qty >= 1 && qty <= max;
}

/**
 * Log API request
 * @param {string} method - HTTP method
 * @param {string} path - API path
 * @param {string} userId - User ID
 */
function logRequest(method, path, userId = 'anonymous') {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - ${method} ${path} - User: ${userId}`);
}

module.exports = {
  isValidEmail,
  sanitizeInput,
  generateOrderId,
  formatCurrency,
  isValidQuantity,
  logRequest
};