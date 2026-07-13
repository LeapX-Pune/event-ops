// js/utils/helpers.js

// --- Date Utilities ---

/**
 * Formats a YYYY-MM-DD date string to a localized date.
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? dateString : date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Formats a time string (e.g., '14:00') into a readable format (e.g., '2:00 PM').
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
 * Checks if a given date string is in the future relative to today.
 */
export function isUpcomingEvent(dateString) {
  if (!dateString) return false;
  const eventDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return eventDate >= today;
}

/**
 * Checks if a given date string is in the past relative to today.
 */
export function isPastEvent(dateString) {
  if (!dateString) return false;
  const eventDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return eventDate < today;
}

/**
 * Compares two date strings for sorting.
 * Returns negative if dateA < dateB, positive if dateA > dateB, 0 if equal.
 */
export function compareDates(dateA, dateB) {
  return new Date(dateA) - new Date(dateB);
}

// --- ID Generation Utilities ---

/**
 * Generates a unique event ID in the format 'evt_XXX' ensuring no duplicates in the provided list.
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

// --- General Helpers ---

/**
 * Deep clones an event object to prevent accidental state mutation.
 */
export function cloneEvent(event) {
  if (!event) return null;
  return JSON.parse(JSON.stringify(event));
}

/**
 * Sorts an array of events by date ascending (oldest first) or descending (newest first).
 */
export function sortEventsByDate(events = [], ascending = true) {
  return [...events].sort((a, b) => {
    const diff = compareDates(a.date, b.date);
    return ascending ? diff : -diff;
  });
}

/**
 * Filters an array of events by category.
 */
export function findEventsByCategory(events = [], category) {
  if (!category) return events;
  return events.filter(e => e.category === category);
}

/**
 * Filters an array of events by location string (case-insensitive partial match).
 */
export function findEventsByLocation(events = [], location) {
  if (!location) return events;
  const query = location.toLowerCase();
  return events.filter(e => e.location && e.location.toLowerCase().includes(query));
}

/**
 * Returns only upcoming events from a given array.
 */
export function findUpcomingEvents(events = []) {
  return events.filter(e => isUpcomingEvent(e.date));
}

/**
 * Calculates remaining available seats for an event.
 */
export function getAvailableSeats(event) {
  if (!event || typeof event.maxAttendees !== 'number' || typeof event.attendees !== 'number') {
    return 0;
  }
  return Math.max(0, event.maxAttendees - event.attendees);
}
