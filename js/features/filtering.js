import { categories } from '../data/categories.js';

// ---- Task 4: Local State for Combined Filters ----
let activeFilters = {
  category: 'all',
  date: 'all',
  search: ''
};

/**
 * ---- Task 1: Category Filtering ----
 * @param {Array} events - The events array
 * @param {string} categoryId - The category to filter by (e.g. 'cat_tech', 'all')
 * @returns {Array} - Filtered events
 */
export function filterByCategory(events, categoryId) {
  if (!categoryId || categoryId === 'all') return events;
  return events.filter(event => event.category === categoryId);
}

/**
 * ---- Task 2: Date Filtering ----
 * @param {Array} events - The events array
 * @param {string} dateFilter - 'today', 'this_week', 'this_month', 'upcoming', 'all'
 * @returns {Array} - Filtered events
 */
export function filterByDate(events, dateFilter) {
  if (!dateFilter || dateFilter === 'all') return events;

  const now = new Date();
  // Normalize current date to midnight for accurate comparisons
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return events.filter(event => {
    const eventDate = new Date(event.date);
    if (isNaN(eventDate)) return false; // Handle invalid dates safely
    
    // Normalize event date to midnight
    const evtStart = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());

    switch (dateFilter) {
      case 'today':
        return evtStart.getTime() === todayStart.getTime();
      case 'this_week': {
        const weekEnd = new Date(todayStart);
        weekEnd.setDate(todayStart.getDate() + 7);
        return evtStart >= todayStart && evtStart <= weekEnd;
      }
      case 'this_month': {
        return evtStart.getMonth() === todayStart.getMonth() && 
               evtStart.getFullYear() === todayStart.getFullYear();
      }
      case 'upcoming':
        return evtStart >= todayStart;
      default:
        return true;
    }
  });
}

/**
 * ---- Task 3: Search Events ----
 * Searches by Title, Venue, Location, and Category Name
 * @param {Array} events - The events array
 * @param {string} query - The search string
 * @returns {Array} - Filtered events
 */
export function searchEvents(events, query) {
  if (!query) return events;
  
  const trimmedQuery = query.trim().toLowerCase();
  if (trimmedQuery.length === 0) return events;

  return events.filter(event => {
    const titleMatch = (event.title || '').toLowerCase().includes(trimmedQuery);
    const locationMatch = (event.location || '').toLowerCase().includes(trimmedQuery);
    
    // Find category name to match against
    const catObj = categories.find(c => c.id === event.category);
    const categoryName = catObj ? catObj.name.toLowerCase() : '';
    const categoryMatch = categoryName.includes(trimmedQuery);

    return titleMatch || locationMatch || categoryMatch;
  });
}

/**
 * ---- Task 4: Combined Filtering ----
 */
export function setFilter(type, value) {
  if (activeFilters.hasOwnProperty(type)) {
    activeFilters[type] = value;
  }
}

export function getActiveFilters() {
  return { ...activeFilters };
}

export function applyCombinedFilters(events) {
  let result = [...events];
  result = filterByCategory(result, activeFilters.category);
  result = filterByDate(result, activeFilters.date);
  result = searchEvents(result, activeFilters.search);
  return result;
}

/**
 * ---- Task 5: Sorting Utilities ----
 */
export function sortByDate(events, order = 'newest') {
  return [...events].sort((a, b) => {
    const dateA = new Date(a.date).getTime() || 0;
    const dateB = new Date(b.date).getTime() || 0;
    return order === 'newest' ? dateB - dateA : dateA - dateB;
  });
}

export function sortByName(events, order = 'asc') {
  return [...events].sort((a, b) => {
    const titleA = (a.title || '').toLowerCase();
    const titleB = (b.title || '').toLowerCase();
    if (order === 'asc') {
      return titleA.localeCompare(titleB);
    } else {
      return titleB.localeCompare(titleA);
    }
  });
}

export function sortByAttendees(events, order = 'highest') {
  return [...events].sort((a, b) => {
    const attA = a.attendees || 0;
    const attB = b.attendees || 0;
    return order === 'highest' ? attB - attA : attA - attB;
  });
}

/**
 * ---- Task 6: Reset Utilities ----
 */
export function resetCategory() {
  activeFilters.category = 'all';
}

export function resetDate() {
  activeFilters.date = 'all';
}

export function resetSearch() {
  activeFilters.search = '';
}

export function resetAllFilters() {
  resetCategory();
  resetDate();
  resetSearch();
}
