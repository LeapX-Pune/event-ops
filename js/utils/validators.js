// js/utils/validators.js — Form validation utilities

/**
 * Validate all fields for the event creation/edit form.
 * @param {Object} data  — raw form data object
 * @returns {{ isValid: boolean, errors: Object }}
 */
export function validateEventForm(data) {
  const errors = {};

  // Title
  if (!data.title || data.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters';
  }

  // Description
  if (!data.description || data.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters';
  }

  // Category
  const validCategories = ['Technology', 'Music', 'Workshop', 'Sports', 'Food', 'Social'];
  if (!data.category || !validCategories.includes(data.category)) {
    errors.category = 'Please select a valid category';
  }

  // Date — must be present and not in the past
  if (!data.date) {
    errors.date = 'Date is required';
  } else {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [y, m, d] = data.date.split('-').map(Number);
    const selected = new Date(y, m - 1, d);
    if (isNaN(selected.getTime())) {
      errors.date = 'Invalid date format';
    } else if (selected < today) {
      errors.date = 'Date cannot be in the past';
    }
  }

  // Time
  if (!data.time) {
    errors.time = 'Time is required';
  }

  // Venue
  if (!data.venue || data.venue.trim().length < 3) {
    errors.venue = 'Venue must be at least 3 characters';
  }

  // Max attendees
  const max = data.maxAttendees;
  if (isNaN(max) || max < 1) {
    errors.maxAttendees = 'Must be at least 1';
  }

  // Image URL — optional, but validate if provided
  if (data.imageUrl && data.imageUrl.trim() !== '') {
    try {
      new URL(data.imageUrl);
    } catch {
      errors.imageUrl = 'Please enter a valid URL (e.g. https://...)';
    }
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

/**
 * Render validation error messages under each form field.
 * @param {HTMLFormElement} form
 * @param {Object} errors  — map of fieldName → errorMessage
 */
export function showValidationErrors(form, errors) {
  clearValidationErrors(form);

  const fieldMap = {
    title:        'eventTitle',
    description:  'eventDescription',
    category:     'eventCategory',
    date:         'eventDate',
    time:         'eventTime',
    venue:        'eventVenue',
    maxAttendees: 'eventMaxAttendees',
    imageUrl:     'eventImageUrl',
  };

  for (const [field, message] of Object.entries(errors)) {
    const inputId = fieldMap[field];
    if (!inputId) continue;
    const input = form.querySelector(`#${inputId}`);
    if (!input) continue;
    const group = input.closest('.form-group');
    if (!group) continue;

    group.classList.add('field-error-wrap');

    const errorEl = document.createElement('span');
    errorEl.className = 'field-error-msg';
    errorEl.innerHTML = `<span class="material-symbols-outlined">error</span> ${message}`;
    errorEl.dataset.errorFor = field;
    group.appendChild(errorEl);
  }

  const firstError = form.querySelector('.field-error-wrap');
  if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Remove all validation error states and messages from the form.
 * @param {HTMLFormElement} form
 */
export function clearValidationErrors(form) {
  form.querySelectorAll('.field-error-wrap').forEach(el => el.classList.remove('field-error-wrap'));
  form.querySelectorAll('.field-error-msg').forEach(el => el.remove());
}
