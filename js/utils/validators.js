// js/utils/validators.js — Reusable validation utilities for the Data Management layer
// These functions validate event fields and return structured results.
// Return format: { isValid: boolean, errors: string[] }

import { categories } from '../data/categories.js';

// -----------------------------------------------------
// INDIVIDUAL FIELD VALIDATORS
// Each returns { isValid: boolean, errors: string[] }
// -----------------------------------------------------

/**
 * Validates an event title.
 * @param {string} title - The event title to validate.
 * @returns {{ isValid: boolean, errors: string[] }} Validation result.
 */
export function validateTitle(title) {
  const errors = [];
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push('Title is required.');
  } else if (title.trim().length < 3) {
    errors.push('Title must be at least 3 characters long.');
  } else if (title.trim().length > 150) {
    errors.push('Title must not exceed 150 characters.');
  }
  return { isValid: errors.length === 0, errors };
}

/**
 * Validates an event description.
 * @param {string} description - The event description to validate.
 * @returns {{ isValid: boolean, errors: string[] }} Validation result.
 */
export function validateDescription(description) {
  const errors = [];
  // Description is optional, but if provided it should be a string
  if (description !== undefined && description !== null && typeof description !== 'string') {
    errors.push('Description must be a string.');
  }
  return { isValid: errors.length === 0, errors };
}

/**
 * Validates an event date string (expected format: YYYY-MM-DD).
 * @param {string} dateStr - The date string to validate.
 * @returns {{ isValid: boolean, errors: string[] }} Validation result.
 */
export function validateDate(dateStr) {
  const errors = [];
  if (!dateStr || typeof dateStr !== 'string') {
    errors.push('Date is required (format: YYYY-MM-DD).');
  } else {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      errors.push('Invalid date format. Use YYYY-MM-DD.');
    }
  }
  return { isValid: errors.length === 0, errors };
}

/**
 * Validates an event time string (expected format: HH:MM).
 * @param {string} timeStr - The time string to validate.
 * @returns {{ isValid: boolean, errors: string[] }} Validation result.
 */
export function validateTime(timeStr) {
  const errors = [];
  if (!timeStr || typeof timeStr !== 'string') {
    errors.push('Time is required (format: HH:MM).');
  } else {
    // Check HH:MM pattern
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(timeStr)) {
      errors.push('Invalid time format. Use HH:MM (24-hour).');
    }
  }
  return { isValid: errors.length === 0, errors };
}

/**
 * Validates an event category against the known categories list.
 * @param {string} category - The category ID to validate.
 * @returns {{ isValid: boolean, errors: string[] }} Validation result.
 */
export function validateCategory(category) {
  const errors = [];
  if (!category || typeof category !== 'string' || category.trim().length === 0) {
    errors.push('Category is required.');
  } else {
    // Check against the known categories list
    const knownIds = categories.map(c => c.id);
    if (!knownIds.includes(category)) {
      errors.push(`Unknown category "${category}". Valid categories: ${knownIds.join(', ')}.`);
    }
  }
  return { isValid: errors.length === 0, errors };
}

/**
 * Validates an event location string.
 * @param {string} location - The location to validate.
 * @returns {{ isValid: boolean, errors: string[] }} Validation result.
 */
export function validateLocation(location) {
  const errors = [];
  if (!location || typeof location !== 'string' || location.trim().length === 0) {
    errors.push('Location is required.');
  }
  return { isValid: errors.length === 0, errors };
}

/**
 * Validates an event image URL.
 * @param {string} image - The image URL to validate.
 * @returns {{ isValid: boolean, errors: string[] }} Validation result.
 */
export function validateImage(image) {
  const errors = [];
  // Image is optional, but if provided it should be a non-empty string
  if (image !== undefined && image !== null) {
    if (typeof image !== 'string' || image.trim().length === 0) {
      errors.push('Image must be a valid URL string.');
    }
  }
  return { isValid: errors.length === 0, errors };
}

/**
 * Validates the attendees count.
 * @param {number} attendees - Current attendee count.
 * @returns {{ isValid: boolean, errors: string[] }} Validation result.
 */
export function validateAttendees(attendees) {
  const errors = [];
  if (attendees === undefined || attendees === null) {
    errors.push('Attendees count is required.');
  } else if (typeof attendees !== 'number' || !Number.isFinite(attendees)) {
    errors.push('Attendees must be a valid number.');
  } else if (attendees < 0) {
    errors.push('Attendees cannot be negative.');
  } else if (!Number.isInteger(attendees)) {
    errors.push('Attendees must be a whole number.');
  }
  return { isValid: errors.length === 0, errors };
}

/**
 * Validates the maximum attendees count.
 * @param {number} maxAttendees - Maximum allowed attendees.
 * @returns {{ isValid: boolean, errors: string[] }} Validation result.
 */
export function validateMaxAttendees(maxAttendees) {
  const errors = [];
  if (maxAttendees === undefined || maxAttendees === null) {
    errors.push('Max Attendees is required.');
  } else if (typeof maxAttendees !== 'number' || !Number.isFinite(maxAttendees)) {
    errors.push('Max Attendees must be a valid number.');
  } else if (maxAttendees <= 0) {
    errors.push('Max Attendees must be greater than zero.');
  } else if (!Number.isInteger(maxAttendees)) {
    errors.push('Max Attendees must be a whole number.');
  }
  return { isValid: errors.length === 0, errors };
}

/**
 * Validates that attendees does not exceed maxAttendees.
 * @param {number} attendees - Current attendee count.
 * @param {number} maxAttendees - Maximum allowed attendees.
 * @returns {{ isValid: boolean, errors: string[] }} Validation result.
 */
export function validateEventCapacity(attendees, maxAttendees) {
  const errors = [];
  if (typeof attendees === 'number' && typeof maxAttendees === 'number') {
    if (attendees > maxAttendees) {
      errors.push('Attendees cannot exceed Max Attendees.');
    }
  }
  return { isValid: errors.length === 0, errors };
}

// ─────────────────────────────────────────────────────────
// COMPOSITE VALIDATOR
// Runs all field validations and collects ALL errors
// ─────────────────────────────────────────────────────────

/**
 * Validates a complete event data object against all rules.
 * Collects ALL errors instead of stopping at the first one.
 * @param {Object} eventData - The event object to validate.
 * @returns {{ isValid: boolean, errors: string[] }} Validation result with all errors.
 */
export function validateEvent(eventData) {
  if (!eventData || typeof eventData !== 'object') {
    return { isValid: false, errors: ['Invalid event data object.'] };
  }

  // Run all field validators and merge their error arrays
  const fieldResults = [
    validateTitle(eventData.title),
    validateDescription(eventData.description),
    validateDate(eventData.date),
    validateTime(eventData.time),
    validateCategory(eventData.category),
    validateLocation(eventData.location),
    validateImage(eventData.image),
    validateAttendees(eventData.attendees),
    validateMaxAttendees(eventData.maxAttendees),
    validateEventCapacity(eventData.attendees, eventData.maxAttendees)
  ];

  // Collect all errors from every validator
  const allErrors = fieldResults.reduce((acc, result) => {
    return acc.concat(result.errors);
  }, []);

  return {
    isValid: allErrors.length === 0,
    errors: allErrors
  };
}
