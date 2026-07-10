// js/admin/crud.js — Higher-level CRUD helpers used by adminApp

// Re-export store operations so adminApp has a unified interface.
export {
  getCustomEvents,
  saveCustomEvents,
  getAllEvents,
  getEventById,
  addEvent,
  updateEvent,
  deleteEvent
} from '../state/store.js';
