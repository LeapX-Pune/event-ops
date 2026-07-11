// js/admin/adminApp.js — Admin dashboard entry point (Conclave)

import { getAllEvents, getEventById, deleteEvent } from './crud.js';
import { renderEventTable } from './eventTable.js';
import { setupFormHandlers, resetForm, populateForm } from './eventForm.js';
import { openModal, closeModal } from '../components/modal.js';

let eventToDelete = null;

function initAdmin() {
  renderTable();

  // Setup form handlers, re-render and close modal on success
  setupFormHandlers(() => {
    renderTable();
    closeModal('event-modal');
  });

  setupModalHandlers();
  setupDeleteHandlers();

  // Listen for data updates
  window.addEventListener('eventsUpdated', () => renderTable());
}

function renderTable() {
  const events = getAllEvents();
  renderEventTable(events, handleEdit, handleDelete);
}

function handleEdit(id) {
  const event = getEventById(id);
  if (!event) return;
  populateForm(event);
  document.getElementById('modal-title').textContent = 'Edit Event';
  document.getElementById('modal-submit').textContent = 'Save Changes';
  openModal('event-modal');
}

function handleDelete(id) {
  eventToDelete = id;
  openModal('delete-modal');
}

function setupModalHandlers() {
  const addBtn = document.getElementById('add-event-btn');
  const cancelBtn = document.getElementById('modal-cancel');
  
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      resetForm();
      document.getElementById('modal-title').textContent = 'Create Event';
      document.getElementById('modal-submit').textContent = 'Create Event';
      openModal('event-modal');
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      closeModal('event-modal');
    });
  }

  // Close form modal on overlay click
  const eventModal = document.getElementById('event-modal');
  if (eventModal) {
    eventModal.addEventListener('click', (e) => {
      if (e.target === eventModal) {
        closeModal('event-modal');
      }
    });
  }

  // Close delete modal on cancel/overlay click
  const deleteCancelBtn = document.getElementById('delete-cancel');
  if (deleteCancelBtn) {
    deleteCancelBtn.addEventListener('click', () => {
      closeModal('delete-modal');
      eventToDelete = null;
    });
  }

  const deleteModal = document.getElementById('delete-modal');
  if (deleteModal) {
    deleteModal.addEventListener('click', (e) => {
      if (e.target === deleteModal) {
        closeModal('delete-modal');
        eventToDelete = null;
      }
    });
  }

  // ESC key handler
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (eventModal && eventModal.classList.contains('open')) {
        closeModal('event-modal');
      }
      if (deleteModal && deleteModal.classList.contains('open')) {
        closeModal('delete-modal');
        eventToDelete = null;
      }
    }
  });
}

function setupDeleteHandlers() {
  const confirmDeleteBtn = document.getElementById('delete-confirm');
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', () => {
      if (!eventToDelete) return;
      const result = deleteEvent(eventToDelete);
      if (result.success) {
        if (typeof window.showToast === 'function') window.showToast('Event deleted successfully.', 'success');
        closeModal('delete-modal');
        renderTable();
      } else {
        if (typeof window.showToast === 'function') window.showToast(result.error || 'Failed to delete event.', 'error');
      }
      eventToDelete = null;
    });
  }
}

document.addEventListener('DOMContentLoaded', initAdmin);
