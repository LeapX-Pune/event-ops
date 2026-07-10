// js/admin/crud.js — Higher-level CRUD helpers used by adminApp

// Re-export store operations so adminApp only needs one import source.
export { addEvent, updateEvent, deleteEvent, getEvents, getEventById } from '../state/store.js';
