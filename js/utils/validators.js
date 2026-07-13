// js/utils/validators.js

export function validateTitle(title) {
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return { valid: false, error: 'Title is required and must be a non-empty string.' };
  }
  return { valid: true };
}

export function validateDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') {
    return { valid: false, error: 'Date is required and must be a valid date string (YYYY-MM-DD).' };
  }
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return { valid: false, error: 'Invalid date format. Use YYYY-MM-DD.' };
  }
  return { valid: true };
}

export function validateCategory(category) {
  if (!category || typeof category !== 'string' || category.trim().length === 0) {
    return { valid: false, error: 'Category is required.' };
  }
  // If strict category checking is needed, we could check against known categories here.
  return { valid: true };
}

export function validateLocation(location) {
  if (!location || typeof location !== 'string' || location.trim().length === 0) {
    return { valid: false, error: 'Location is required and must be a non-empty string.' };
  }
  return { valid: true };
}

export function validateAttendees(attendees) {
  if (attendees === undefined || attendees === null || typeof attendees !== 'number') {
    return { valid: false, error: 'Attendees must be a valid number.' };
  }
  if (attendees < 0) {
    return { valid: false, error: 'Attendees cannot be negative.' };
  }
  return { valid: true };
}

export function validateMaxAttendees(attendees, maxAttendees) {
  if (maxAttendees === undefined || maxAttendees === null || typeof maxAttendees !== 'number') {
    return { valid: false, error: 'Max Attendees must be a valid number.' };
  }
  if (maxAttendees <= 0) {
    return { valid: false, error: 'Max Attendees must be greater than zero.' };
  }
  if (attendees > maxAttendees) {
    return { valid: false, error: 'Attendees cannot exceed Max Attendees.' };
  }
  return { valid: true };
}

export function validateEvent(eventData) {
  if (!eventData || typeof eventData !== 'object') {
    return { valid: false, error: 'Invalid event data object.' };
  }

  const validations = [
    validateTitle(eventData.title),
    validateDate(eventData.date),
    validateCategory(eventData.category),
    validateLocation(eventData.location),
    validateAttendees(eventData.attendees),
    validateMaxAttendees(eventData.attendees, eventData.maxAttendees)
  ];

  for (const result of validations) {
    if (!result.valid) {
      return result; // return the first error found
    }
  }

  return { valid: true };
}
