// js/state/store.js — LocalStorage-backed event data store

const CUSTOM_EVENTS_KEY = 'conclave_custom_events';

export function getCustomEvents() {
  return JSON.parse(localStorage.getItem(CUSTOM_EVENTS_KEY) || '[]');
}

export function saveCustomEvents(events) {
  localStorage.setItem(CUSTOM_EVENTS_KEY, JSON.stringify(events));
  window.dispatchEvent(new CustomEvent('eventsUpdated'));
}

export function getAllEvents() {
  const builtIn = (window.CONCLAVE_EVENTS || []).map(e => ({ ...e, builtIn: true }));
  const custom = getCustomEvents().map(e => ({ ...e, builtIn: false }));
  return [...builtIn, ...custom];
}

export function getEventById(id) {
  return getAllEvents().find(e => e.id === id);
}

export function addEvent(eventData) {
  try {
    const events = getCustomEvents();
    events.push(eventData);
    saveCustomEvents(events);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export function updateEvent(id, eventData) {
  try {
    const events = getCustomEvents();
    const idx = events.findIndex(e => e.id === id);
    if (idx === -1) return { success: false, error: 'Event not found' };
    events[idx] = eventData;
    saveCustomEvents(events);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export function deleteEvent(id) {
  try {
    let events = getCustomEvents();
    const filtered = events.filter(e => e.id !== id);
    if (filtered.length === events.length) {
      return { success: false, error: 'Event not found' };
    }
    saveCustomEvents(filtered);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
