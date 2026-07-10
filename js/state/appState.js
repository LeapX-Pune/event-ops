import { events } from '../data/events.js';

export const initialState = {
  events: [...events],
  filteredEvents: [...events]
};
