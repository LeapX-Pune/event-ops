// js/utils/errorHandler.js — Reusable error handling utilities for the Data Management layer
// These functions provide consistent error creation, logging, and safe execution wrappers.

// --------------------------
// ERROR CREATION
// --------------------------

/**
 * Creates a structured error object with a consistent format.
 * Useful for returning errors from data layer operations.
 * @param {string} message - Human-readable error message.
 * @param {string} code - Short error code for programmatic handling (e.g., "INVALID_ID").
 * @param {Object} details - Optional additional context about the error.
 * @returns {{ message: string, code: string, details: Object, timestamp: string }}
 */
export function createError(message, code = 'UNKNOWN_ERROR', details = {}) {
  return {
    message: message || 'An unexpected error occurred.',
    code,
    details,
    timestamp: new Date().toISOString()
  };
}

// --------------------------
// ERROR LOGGING
// --------------------------

/**
 * Logs an error to the console with a consistent prefix and formatting.
 * Does NOT throw or crash the app — purely informational.
 * @param {string} context - Where the error occurred (e.g., "addEvent").
 * @param {Error|string} error - The error object or message.
 * @returns {void}
 */
export function logError(context, error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[DataLayer:${context}] ${message}`);
}

// --------------------------
// SAFE EXECUTION WRAPPER
// --------------------------

/**
 * Wraps a function call in a try/catch to prevent crashes.
 * Returns a result object indicating success or failure.
 * @param {Function} fn - The function to execute safely.
 * @param {string} context - A label for error logging (e.g., "deleteEvent").
 * @returns {{ success: boolean, data?: *, error?: string }}
 */
export function safeExecute(fn, context = 'unknown') {
  try {
    const result = fn();
    return { success: true, data: result };
  } catch (error) {
    logError(context, error);
    return { success: false, error: error.message || 'An unexpected error occurred.' };
  }
}

// --------------------------
// REQUIRED FIELDS VALIDATOR
// --------------------------

/**
 * Validates that all specified fields exist and are non-empty in a given object.
 * Useful for quick pre-checks before processing data.
 * @param {Object} obj - The object to check.
 * @param {string[]} requiredFields - Array of field names that must be present.
 * @returns {{ isValid: boolean, missingFields: string[] }}
 */
export function validateRequiredFields(obj, requiredFields = []) {
  if (!obj || typeof obj !== 'object') {
    return { isValid: false, missingFields: [...requiredFields] };
  }

  const missingFields = requiredFields.filter(field => {
    const value = obj[field];
    // Field is missing if it's undefined, null, or an empty string
    return value === undefined || value === null || value === '';
  });

  return {
    isValid: missingFields.length === 0,
    missingFields
  };
}
