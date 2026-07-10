// js/admin/eventForm.js — Create & Edit form handling

import { addEvent, updateEvent } from './crud.js';
import {
  validateEventForm,
  showValidationErrors,
  clearValidationErrors,
} from '../utils/validators.js';
import { showToast } from '../utils/helpers.js';
import { closeModal } from '../components/modal.js';

let isEditing      = false;
let editingEventId = null;

/** Wire up form submit handler. Call once after DOM ready. */
export function setupFormHandlers() {
  getForm()?.addEventListener('submit', handleSubmit);
}

/** Reset the form to empty / create mode. */
export function resetForm() {
  const form = getForm();
  if (!form) return;
  form.reset();
  document.getElementById('eventId').value = '';
  clearValidationErrors(form);
  isEditing      = false;
  editingEventId = null;
}

/** Pre-populate form for editing an existing event. */
export function populateForm(event) {
  const form = getForm();
  if (!form || !event) return;

  isEditing      = true;
  editingEventId = event.id;

  document.getElementById('eventId').value          = event.id;
  document.getElementById('eventTitle').value        = event.title;
  document.getElementById('eventDescription').value  = event.description;
  document.getElementById('eventCategory').value     = event.category;
  document.getElementById('eventDate').value         = event.date;
  document.getElementById('eventTime').value         = event.time;
  document.getElementById('eventVenue').value        = event.venue;
  document.getElementById('eventImageUrl').value     = event.imageUrl || '';
  document.getElementById('eventMaxAttendees').value = event.maxAttendees;

  clearValidationErrors(form);
}

// ─────────────────────────────────────────────────────────
// Internal
// ─────────────────────────────────────────────────────────

function getForm() {
  return document.getElementById('eventForm');
}

function handleSubmit(e) {
  e.preventDefault();
  const form = e.currentTarget;

  const formData = {
    title:        form.title.value.trim(),
    description:  form.description.value.trim(),
    category:     form.category.value,
    date:         form.date.value,
    time:         form.time.value,
    venue:        form.venue.value.trim(),
    imageUrl:     form.imageUrl.value.trim(),
    maxAttendees: parseInt(form.maxAttendees.value, 10),
  };

  const validation = validateEventForm(formData);

  if (!validation.isValid) {
    showValidationErrors(form, validation.errors);
    return;
  }

  clearValidationErrors(form);

  if (isEditing && editingEventId) {
    const result = updateEvent(editingEventId, formData);
    if (result.success) {
      showToast('Event updated successfully', 'success');
      closeFormAndReset();
    } else {
      showToast(result.error || 'Failed to update event', 'error');
    }
  } else {
    const result = addEvent(formData);
    if (result.success) {
      showToast('Event created successfully', 'success');
      closeFormAndReset();
    } else {
      showToast(result.error || 'Failed to create event', 'error');
    }
  }
}

function closeFormAndReset() {
  closeModal('formModal');
  resetForm();
}
