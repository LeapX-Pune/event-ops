// js/state/store.js — LocalStorage-backed event data store

import { STORAGE_KEYS } from '../utils/storageKeys.js';
import { validateEvent } from '../utils/validators.js';
import { generateEventId, cloneEvent } from '../utils/helpers.js';

/**
 * Retrieves custom events from local storage.
 */
export function getCustomEvents() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS) || '[]');
  } catch (e) {
    return [];
  }
}

/**
 * Saves custom events back to local storage and triggers an update event.
 */
export function saveCustomEvents(events) {
  try {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    // Trigger global event for components to listen to
    window.dispatchEvent(new CustomEvent('eventsUpdated'));
  } catch (e) {
    console.error("Failed to save events to local storage:", e);
  }
}

/**
 * Returns all events: built-in from window.CONCLAVE_EVENTS + custom from local storage.
 */
export function getAllEvents() {
  const builtIn = (window.CONCLAVE_EVENTS || []).map(e => ({ ...e, builtIn: true }));
  const custom = getCustomEvents().map(e => ({ ...e, builtIn: false }));
  return [...builtIn, ...custom];
}

/**
 * Retrieves a specific event by ID.
 */
export function getEventById(id) {
  if (!id || typeof id !== 'string') {
    return null;
  }
  const event = getAllEvents().find(e => e.id === id);
  return event ? cloneEvent(event) : null;
}

/**
 * Adds a new event to the custom events store.
 */
export function addEvent(eventData) {
  try {
    // Validate event structure
    const validation = validateEvent(eventData);
    if (!validation.isValid) {
      return { success: false, error: validation.errors.join(' ') };
    }

    const events = getCustomEvents();
    
    // Create new event object
    const newEvent = cloneEvent(eventData);
    
    // Check if ID was provided or we need to generate one
    if (newEvent.id) {
      // Ensure no duplicate IDs exist globally
      const allExisting = getAllEvents();
      if (allExisting.some(e => e.id === newEvent.id)) {
        return { success: false, error: 'Duplicate Event ID.' };
      }
    } else {
      newEvent.id = generateEventId(getAllEvents());
    }

    events.push(newEvent);
    saveCustomEvents(events);
    
    return { success: true, data: newEvent };
  } catch (err) {
    return { success: false, error: err.message || 'An error occurred while adding the event.' };
  }
}

/**
 * Updates an existing custom event by ID.
 */
export function updateEvent(id, eventData) {
  try {
    if (!id || typeof id !== 'string') {
      return { success: false, error: 'Invalid Event ID.' };
    }

    // Validate incoming data
    const validation = validateEvent(eventData);
    if (!validation.isValid) {
      return { success: false, error: validation.errors.join(' ') };
    }

    const events = getCustomEvents();
    const idx = events.findIndex(e => e.id === id);
    
    if (idx === -1) {
      // Check if trying to update a built-in event
      const allEvents = getAllEvents();
      if (allEvents.some(e => e.id === id && e.builtIn)) {
        return { success: false, error: 'Cannot update built-in events.' };
      }
      return { success: false, error: 'Event not found.' };
    }

    // Preserve ID and update
    const updatedEvent = { ...cloneEvent(eventData), id };
    events[idx] = updatedEvent;
    
    saveCustomEvents(events);
    return { success: true, data: updatedEvent };
  } catch (err) {
    return { success: false, error: err.message || 'An error occurred while updating the event.' };
  }
}

/**
 * Deletes an existing custom event by ID.
 */
export function deleteEvent(id) {
  try {
    if (!id || typeof id !== 'string') {
      return { success: false, error: 'Invalid Event ID.' };
    }

    const events = getCustomEvents();
    const filtered = events.filter(e => e.id !== id);
    
    if (filtered.length === events.length) {
      // Check if trying to delete a built-in event
      const allEvents = getAllEvents();
      if (allEvents.some(e => e.id === id && e.builtIn)) {
        return { success: false, error: 'Cannot delete built-in events.' };
      }
      return { success: false, error: 'Event not found.' };
    }
    
    saveCustomEvents(filtered);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message || 'An error occurred while deleting the event.' };
  }
}
