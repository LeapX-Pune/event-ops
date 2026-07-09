// js/state/store.js — LocalStorage-backed event data store

const STORAGE_KEY = 'eventhub_events';

/** Seed data shown on first load */
const SEED_EVENTS = [
  {
    id: 1001,
    title: 'React & Beyond — Frontend Summit',
    description: 'A full-day conference covering the latest in React, Next.js, and the modern frontend ecosystem. Speakers from top companies share real-world insights.',
    category: 'Technology',
    date: '2025-09-20',
    time: '09:00',
    venue: 'Pune Tech Hub, Baner',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80',
    maxAttendees: 200,
    attendees: 143,
  },
  {
    id: 1002,
    title: 'Indie Music Night — Open Mic Edition',
    description: 'An evening of soulful acoustic sets and original compositions by indie artists from across the city. Come, listen, or perform!',
    category: 'Music',
    date: '2025-08-30',
    time: '19:00',
    venue: 'Blue Frog, Mumbai',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80',
    maxAttendees: 80,
    attendees: 62,
  },
  {
    id: 1003,
    title: 'Pottery & Mindfulness Workshop',
    description: 'Learn the basics of hand-building pottery in this beginner-friendly 3-hour workshop. All materials included. Max 20 participants.',
    category: 'Workshop',
    date: '2025-10-05',
    time: '10:30',
    venue: 'Studio Clay, Koregaon Park',
    imageUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&q=80',
    maxAttendees: 20,
    attendees: 14,
  },
];

// ─────────────────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────────────────

function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeStorage(events) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

function dispatch() {
  window.dispatchEvent(new CustomEvent('eventsUpdated'));
}

// ─────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────

/**
 * Initialise the store. Seeds data on the very first run.
 */
export function initializeStore() {
  const existing = readStorage();
  if (!existing) {
    writeStorage(SEED_EVENTS);
  }
}

/**
 * Return all events (sorted newest date first).
 * @returns {Array}
 */
export function getEvents() {
  return readStorage() || [];
}

/**
 * Return a single event by ID.
 * @param {number} id
 * @returns {Object|undefined}
 */
export function getEventById(id) {
  return getEvents().find(e => e.id === Number(id));
}

/**
 * Add a new event.
 * @param {Object} data
 * @returns {{ success: boolean, event?: Object, error?: string }}
 */
export function addEvent(data) {
  try {
    const events = getEvents();
    const newEvent = {
      ...data,
      id:        Date.now(),
      attendees: 0,
    };
    events.push(newEvent);
    writeStorage(events);
    dispatch();
    return { success: true, event: newEvent };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Update an existing event (preserves attendee count).
 * @param {number} id
 * @param {Object} data
 * @returns {{ success: boolean, event?: Object, error?: string }}
 */
export function updateEvent(id, data) {
  try {
    const events = getEvents();
    const idx = events.findIndex(e => e.id === Number(id));
    if (idx === -1) return { success: false, error: 'Event not found' };

    const updated = {
      ...events[idx],   // preserve id + attendees
      ...data,
      id:        events[idx].id,
      attendees: events[idx].attendees,
    };
    events[idx] = updated;
    writeStorage(events);
    dispatch();
    return { success: true, event: updated };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Delete an event by ID.
 * @param {number} id
 * @returns {{ success: boolean, error?: string }}
 */
export function deleteEvent(id) {
  try {
    const events = getEvents();
    const filtered = events.filter(e => e.id !== Number(id));
    if (filtered.length === events.length) {
      return { success: false, error: 'Event not found' };
    }
    writeStorage(filtered);
    dispatch();
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
