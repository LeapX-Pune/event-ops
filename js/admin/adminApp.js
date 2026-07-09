// js/admin/adminApp.js — Admin dashboard entry point (Conclave)

import { getEvents, deleteEvent, getEventById, initializeStore } from './crud.js';
import { renderEventTable, updateStats }                         from './eventTable.js';
import { setupFormHandlers, resetForm, populateForm }            from './eventForm.js';
import { showToast }                                             from '../utils/helpers.js';
import { openModal, closeModal }                                 from '../components/modal.js';
import { initDarkMode }                                          from '../features/darkMode.js';

// ─────────────────────────────────────────────────────────
// State
// ─────────────────────────────────────────────────────────
let eventToDelete = null;
let searchQuery   = '';

// ─────────────────────────────────────────────────────────
// Init
// ─────────────────────────────────────────────────────────
function initAdmin() {
  initializeStore();
  initDarkMode();
  renderTable();
  setupFormHandlers();
  setupModalHandlers();
  setupDeleteHandlers();
  setupSearch();
  setupEmptyBtn();

  window.addEventListener('eventsUpdated', () => renderTable());
}

// ─────────────────────────────────────────────────────────
// Table
// ─────────────────────────────────────────────────────────
function renderTable() {
  const events = getEvents();
  renderEventTable(events, searchQuery);
  updateStats(events);
}

// ─────────────────────────────────────────────────────────
// Search
// ─────────────────────────────────────────────────────────
function setupSearch() {
  const input = document.getElementById('tableSearchInput');
  if (!input) return;
  input.addEventListener('input', e => {
    searchQuery = e.target.value;
    renderTable();
  });
}

// ─────────────────────────────────────────────────────────
// Modal handlers
// ─────────────────────────────────────────────────────────
function setupModalHandlers() {
  // Create btn
  const createBtn = document.getElementById('createEventBtn');
  if (createBtn) {
    createBtn.addEventListener('click', () => {
      resetForm();
      document.getElementById('formModalTitle').textContent = 'Create Event';
      openModal('formModal');
    });
  }

  // Close form
  const closeForm = () => { closeModal('formModal'); resetForm(); };
  document.getElementById('closeFormModal')?.addEventListener('click', closeForm);
  document.getElementById('cancelFormBtn')?.addEventListener('click', closeForm);

  // Close delete
  const closeDel = () => { closeModal('deleteModal'); eventToDelete = null; };
  document.getElementById('cancelDeleteBtn')?.addEventListener('click', closeDel);

  // Overlay click closes
  ['formModal', 'deleteModal'].forEach(id => {
    document.getElementById(id)?.addEventListener('click', e => {
      if (e.target.id === id) {
        if (id === 'formModal') closeForm();
        else closeDel();
      }
    });
  });

  // ESC key
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (document.getElementById('formModal')?.classList.contains('open'))   closeForm();
    if (document.getElementById('deleteModal')?.classList.contains('open')) closeDel();
  });

  // Expose globally for inline onclick in table rows
  window.openEditModal = (eventId) => {
    const event = getEventById(eventId);
    if (!event) { showToast('Event not found', 'error'); return; }
    populateForm(event);
    document.getElementById('formModalTitle').textContent = 'Edit Event';
    openModal('formModal');
  };

  window.openDeleteModal = (eventId, eventTitle) => {
    eventToDelete = eventId;
    const span = document.getElementById('deleteEventTitle');
    if (span) span.textContent = eventTitle;
    openModal('deleteModal');
  };
}

// ─────────────────────────────────────────────────────────
// Delete
// ─────────────────────────────────────────────────────────
function setupDeleteHandlers() {
  document.getElementById('confirmDeleteBtn')?.addEventListener('click', () => {
    if (!eventToDelete) return;
    const result = deleteEvent(eventToDelete);
    if (result.success) {
      showToast('Event deleted successfully', 'success');
      closeModal('deleteModal');
      eventToDelete = null;
    } else {
      showToast(result.error || 'Failed to delete event', 'error');
    }
  });
}

// ─────────────────────────────────────────────────────────
// Empty state create button
// ─────────────────────────────────────────────────────────
function setupEmptyBtn() {
  document.getElementById('emptyCreateBtn')?.addEventListener('click', () => {
    resetForm();
    document.getElementById('formModalTitle').textContent = 'Create Event';
    openModal('formModal');
  });
}

// ─────────────────────────────────────────────────────────
// Boot
// ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', initAdmin);
