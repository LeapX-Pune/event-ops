// js/utils/helpers.js — Reusable helper utilities for the Data Management layer
// Contains date/time formatting, ID generation, sorting, filtering, and general helpers.

import { categories } from '../data/categories.js';

// -----------------------------------
// SECTION 1: DATE & TIME UTILITIES
// -----------------------------------

/**
 * Formats a YYYY-MM-DD date string into a human-readable localized date.
 * @param {string} dateString - Date in YYYY-MM-DD format.
 * @returns {string} Formatted date (e.g., "July 13, 2026") or empty string if invalid.
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Formats a time string (e.g., '14:00') into a readable 12-hour format.
 * @param {string} timeString - Time in HH:MM format.
 * @returns {string} Formatted time (e.g., "2:00 PM") or empty string if invalid.
 */
export function formatTime(timeString) {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');
  if (!hours || !minutes) return timeString;
  const date = new Date();
  date.setHours(parseInt(hours, 10), parseInt(minutes, 10));
  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit'
  });
}

/**
 * Formats a date and time together into a single readable string.
 * @param {string} dateString - Date in YYYY-MM-DD format.
 * @param {string} timeString - Time in HH:MM format.
 * @returns {string} Combined formatted string (e.g., "July 13, 2026 at 2:00 PM").
 */
export function formatDateTime(dateString, timeString) {
  const formattedDate = formatDate(dateString);
  const formattedTime = formatTime(timeString);
  if (!formattedDate && !formattedTime) return '';
  if (!formattedTime) return formattedDate;
  if (!formattedDate) return formattedTime;
  return `${formattedDate} at ${formattedTime}`;
}

/**
 * Returns today's date as a YYYY-MM-DD string.
 * @returns {string} Today's date in YYYY-MM-DD format.
 */
export function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Compares two date strings for sorting purposes.
 * @param {string} dateA - First date string (YYYY-MM-DD).
 * @param {string} dateB - Second date string (YYYY-MM-DD).
 * @returns {number} Negative if dateA < dateB, positive if dateA > dateB, 0 if equal.
 */
export function compareDates(dateA, dateB) {
  return new Date(dateA) - new Date(dateB);
}

/**
 * Checks if a given date string is in the past (before today).
 * @param {string} dateString - Date in YYYY-MM-DD format.
 * @returns {boolean} True if the date is before today.
 */
export function isPastDate(dateString) {
  if (!dateString) return false;
  const eventDate = new Date(dateString);
  if (isNaN(eventDate.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return eventDate < today;
}

/**
 * Checks if a given date string is today.
 * @param {string} dateString - Date in YYYY-MM-DD format.
 * @returns {boolean} True if the date matches today's date.
 */
export function isToday(dateString) {
  if (!dateString) return false;
  const eventDate = new Date(dateString);
  if (isNaN(eventDate.getTime())) return false;
  const today = new Date();
  return (
    eventDate.getFullYear() === today.getFullYear() &&
    eventDate.getMonth() === today.getMonth() &&
    eventDate.getDate() === today.getDate()
  );
}

/**
 * Checks if a given date string is in the future (after today).
 * @param {string} dateString - Date in YYYY-MM-DD format.
 * @returns {boolean} True if the date is after today.
 */
export function isFutureDate(dateString) {
  if (!dateString) return false;
  const eventDate = new Date(dateString);
  if (isNaN(eventDate.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  eventDate.setHours(0, 0, 0, 0);
  return eventDate > today;
}

/**
 * Checks if a given event date is upcoming (today or in the future).
 * @param {string} dateString - Date in YYYY-MM-DD format.
 * @returns {boolean} True if the event hasn't happened yet.
 */
export function isUpcomingEvent(dateString) {
  return isToday(dateString) || isFutureDate(dateString);
}

// ═════════════════════════════════════════════════════════
// SECTION 2: UNIQUE ID GENERATION
// ═════════════════════════════════════════════════════════

/**
 * Generates a unique event ID in the format 'evt_XXX'.
 * Scans existing events to find the highest number and increments it.
 * @param {Array} existingEvents - Array of event objects with `id` properties.
 * @returns {string} A unique event ID (e.g., "evt_068").
 */
export function generateEventId(existingEvents = []) {
  let maxIdNum = 0;

  existingEvents.forEach(event => {
    if (event.id && event.id.startsWith('evt_')) {
      const numPart = parseInt(event.id.replace('evt_', ''), 10);
      if (!isNaN(numPart) && numPart > maxIdNum) {
        maxIdNum = numPart;
      }
    }
  });

  const nextIdNum = maxIdNum + 1;
  return `evt_${nextIdNum.toString().padStart(3, '0')}`;
}

/**
 * Generates a unique category ID in the format 'cat_xxx'.
 * Scans existing categories to prevent duplicates.
 * @param {string} categoryName - The name of the new category.
 * @param {Array} existingCategories - Array of category objects with `id` properties.
 * @returns {string} A unique category ID (e.g., "cat_gaming").
 */
export function generateCategoryId(categoryName, existingCategories = categories) {
  // Create a slug from the category name
  const slug = categoryName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
  const baseId = `cat_${slug}`;

  // Check if this ID already exists
  const existingIds = existingCategories.map(c => c.id);
  if (!existingIds.includes(baseId)) {
    return baseId;
  }

  // If duplicate, append a number suffix
  let counter = 2;
  while (existingIds.includes(`${baseId}_${counter}`)) {
    counter++;
  }
  return `${baseId}_${counter}`;
}

// ═════════════════════════════════════════════════════════
// SECTION 3: GENERAL HELPER FUNCTIONS
// ═════════════════════════════════════════════════════════

/**
 * Deep clones any object or array to prevent accidental state mutation.
 * Uses JSON serialization for a safe, deep copy.
 * @param {*} data - The object or array to clone.
 * @returns {*} A deep copy of the input, or null if input is falsy.
 */
export function deepClone(data) {
  if (!data) return null;
  return JSON.parse(JSON.stringify(data));
}

// Keep the old name as an alias for backwards compatibility with Day 5 store.js
export const cloneEvent = deepClone;

/**
 * Capitalizes the first letter of every word in a string.
 * @param {string} str - The input string.
 * @returns {string} The string with each word capitalized.
 */
export function capitalizeWords(str) {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/\b\w/g, char => char.toUpperCase());
}

/**
 * Truncates a string to a specified maximum length, appending '...' if truncated.
 * @param {string} text - The text to truncate.
 * @param {number} maxLength - Maximum character length (default: 100).
 * @returns {string} The truncated text.
 */
export function truncateText(text, maxLength = 100) {
  if (!text || typeof text !== 'string') return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trimEnd() + '...';
}

/**
 * Sorts an array of events by date.
 * @param {Array} events - Array of event objects.
 * @param {boolean} ascending - Sort oldest-first (true) or newest-first (false). Default: true.
 * @returns {Array} A new sorted array (does not mutate the original).
 */
export function sortEventsByDate(events = [], ascending = true) {
  return [...events].sort((a, b) => {
    const diff = compareDates(a.date, b.date);
    return ascending ? diff : -diff;
  });
}

/**
 * Sorts an array of events alphabetically by title.
 * @param {Array} events - Array of event objects.
 * @param {boolean} ascending - Sort A-Z (true) or Z-A (false). Default: true.
 * @returns {Array} A new sorted array (does not mutate the original).
 */
export function sortEventsByName(events = [], ascending = true) {
  return [...events].sort((a, b) => {
    const nameA = (a.title || '').toLowerCase();
    const nameB = (b.title || '').toLowerCase();
    const compare = nameA.localeCompare(nameB);
    return ascending ? compare : -compare;
  });
}

/**
 * Finds a single event by its ID from an array of events.
 * @param {Array} events - Array of event objects.
 * @param {string} id - The event ID to search for.
 * @returns {Object|null} The matching event object (cloned), or null if not found.
 */
export function findEventById(events = [], id) {
  if (!id) return null;
  const event = events.find(e => e.id === id);
  return event ? deepClone(event) : null;
}

/**
 * Finds a category by its ID from the categories dataset.
 * @param {string} categoryId - The category ID to search for.
 * @returns {Object|null} The matching category object, or null if not found.
 */
export function findCategoryById(categoryId) {
  if (!categoryId) return null;
  return categories.find(c => c.id === categoryId) || null;
}

/**
 * Filters events by category.
 * @param {Array} events - Array of event objects.
 * @param {string} category - The category ID to filter by.
 * @returns {Array} Filtered events matching the category.
 */
export function findEventsByCategory(events = [], category) {
  if (!category) return events;
  return events.filter(e => e.category === category);
}

/**
 * Filters events by location (case-insensitive partial match).
 * @param {Array} events - Array of event objects.
 * @param {string} location - Location query string.
 * @returns {Array} Filtered events matching the location.
 */
export function findEventsByLocation(events = [], location) {
  if (!location) return events;
  const query = location.toLowerCase();
  return events.filter(e => e.location && e.location.toLowerCase().includes(query));
}

/**
 * Returns only upcoming events (today or in the future) from an array.
 * @param {Array} events - Array of event objects.
 * @returns {Array} Events that haven't happened yet.
 */
export function findUpcomingEvents(events = []) {
  return events.filter(e => isUpcomingEvent(e.date));
}

/**
 * Calculates remaining available seats for an event.
 * @param {Object} event - An event object with `attendees` and `maxAttendees`.
 * @returns {number} Number of available seats (minimum 0).
 */
export function getAvailableSeats(event) {
  if (!event || typeof event.maxAttendees !== 'number' || typeof event.attendees !== 'number') {
    return 0;
  }
  return Math.max(0, event.maxAttendees - event.attendees);
}

// Alias for semantic clarity
export const calculateRemainingSeats = getAvailableSeats;
