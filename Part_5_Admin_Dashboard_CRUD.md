# Part 5: Admin Dashboard & CRUD Operations

**Role:** Admin Feature Developer  
**Files Owned:** `admin.html`, `css/admin.css`, `js/admin/*`, `js/components/modal.js`  
**Priority:** Phase 4 (After Data Layer)

---

## 1. Role Overview

This role builds the admin dashboard that allows administrators to create, read, update, and delete events. The admin interface includes a table view of all events, a create/edit form with validation, and delete confirmation modals. All operations persist to LocalStorage.

---

## 2. Task List

### 2.1 Admin HTML Structure

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1.1 | Create `admin.html` | TODO | Separate page for admin |
| 1.2 | Add admin-specific nav | TODO | Link back to homepage |
| 1.3 | Create event table container | TODO | For event list |
| 1.4 | Create form modal | TODO | Create/edit form |
| 1.5 | Create delete confirmation modal | TODO | Confirm before delete |

**Implementation - admin.html:**

```html
<!-- admin.html -->
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EventHub - Admin Dashboard</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="css/main.css">
  <link rel="stylesheet" href="css/components.css">
  <link rel="stylesheet" href="css/admin.css">
  <link rel="stylesheet" href="css/themes.css">
  <link rel="stylesheet" href="css/responsive.css">
</head>
<body>
  <nav class="navbar" id="navbar">
    <div class="nav-container">
      <a href="index.html" class="nav-logo">
        <img src="assets/images/logo.png" alt="EventHub" class="logo-img">
        <span class="logo-text">EventHub</span>
      </a>
      <button class="nav-toggle" id="navToggle" aria-label="Toggle navigation">
        <i class="fas fa-bars"></i>
      </button>
      <ul class="nav-menu" id="navMenu">
        <li><a href="index.html" class="nav-link">Home</a></li>
        <li><a href="admin.html" class="nav-link active">Admin</a></li>
        <li>
          <button class="theme-toggle" id="themeToggle" aria-label="Toggle dark mode">
            <i class="fas fa-moon"></i>
          </button>
        </li>
      </ul>
    </div>
  </nav>

  <main class="admin-main">
    <div class="admin-container">
      <header class="admin-header">
        <div class="admin-header-content">
          <h1 class="admin-title">Event Management</h1>
          <p class="admin-subtitle">Create, edit, and manage your events</p>
        </div>
        <button class="btn btn-primary" id="createEventBtn">
          <i class="fas fa-plus"></i>
          Create New Event
        </button>
      </header>

      <div class="admin-stats">
        <div class="stat-card">
          <i class="fas fa-calendar"></i>
          <div class="stat-info">
            <span class="stat-value" id="totalEvents">0</span>
            <span class="stat-label">Total Events</span>
          </div>
        </div>
        <div class="stat-card">
          <i class="fas fa-users"></i>
          <div class="stat-info">
            <span class="stat-value" id="totalAttendees">0</span>
            <span class="stat-label">Total Attendees</span>
          </div>
        </div>
        <div class="stat-card">
          <i class="fas fa-folder"></i>
          <div class="stat-info">
            <span class="stat-value" id="totalCategories">0</span>
            <span class="stat-label">Categories</span>
          </div>
        </div>
      </div>

      <div class="admin-table-container">
        <table class="admin-table" id="eventTable">
          <thead>
            <tr>
              <th>#</th>
              <th>Event</th>
              <th>Category</th>
              <th>Date</th>
              <th>Attendees</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="eventTableBody">
            <!-- Event rows rendered by JS -->
          </tbody>
        </table>
        <div class="no-events-admin" id="noEventsAdmin" style="display: none;">
          <i class="fas fa-calendar-plus"></i>
          <p>No events yet. Create your first event!</p>
        </div>
      </div>
    </div>
  </main>

  <!-- Event Form Modal -->
  <div class="modal-overlay" id="formModal" style="display: none;">
    <div class="modal modal-form">
      <div class="modal-header modal-header-form">
        <h2 id="formModalTitle">Create New Event</h2>
        <button class="modal-close" id="closeFormModal" aria-label="Close">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="modal-body">
        <form id="eventForm" novalidate>
          <input type="hidden" id="eventId" name="id">

          <div class="form-group">
            <label for="eventTitle">Event Title *</label>
            <input type="text" id="eventTitle" name="title" required minlength="3"
                   placeholder="Enter event title">
          </div>

          <div class="form-group">
            <label for="eventDescription">Description *</label>
            <textarea id="eventDescription" name="description" required minlength="10"
                      rows="4" placeholder="Describe your event"></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="eventCategory">Category *</label>
              <select id="eventCategory" name="category" required>
                <option value="">Select category</option>
                <option value="Technology">Technology</option>
                <option value="Music">Music</option>
                <option value="Workshop">Workshop</option>
                <option value="Sports">Sports</option>
                <option value="Food">Food</option>
                <option value="Social">Social</option>
              </select>
            </div>

            <div class="form-group">
              <label for="eventDate">Date *</label>
              <input type="date" id="eventDate" name="date" required>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="eventTime">Time *</label>
              <input type="time" id="eventTime" name="time" required>
            </div>

            <div class="form-group">
              <label for="eventMaxAttendees">Max Attendees *</label>
              <input type="number" id="eventMaxAttendees" name="maxAttendees"
                     required min="1" placeholder="e.g., 100">
            </div>
          </div>

          <div class="form-group">
            <label for="eventVenue">Venue *</label>
            <input type="text" id="eventVenue" name="venue" required minlength="3"
                   placeholder="Enter venue name">
          </div>

          <div class="form-group">
            <label for="eventImageUrl">Image URL (optional)</label>
            <input type="url" id="eventImageUrl" name="imageUrl"
                   placeholder="https://example.com/image.jpg">
            <span class="form-hint">Leave blank for placeholder image</span>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-secondary" id="cancelFormBtn">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary" id="submitFormBtn">
              <i class="fas fa-save"></i>
              Save Event
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <div class="modal-overlay" id="deleteModal" style="display: none;">
    <div class="modal modal-confirm">
      <div class="modal-body">
        <div class="confirm-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <h3 class="confirm-title">Delete Event</h3>
        <p class="confirm-message">
          Are you sure you want to delete "<span id="deleteEventTitle"></span>"?
          This action cannot be undone.
        </p>
        <div class="confirm-actions">
          <button class="btn btn-secondary" id="cancelDeleteBtn">
            Cancel
          </button>
          <button class="btn btn-danger" id="confirmDeleteBtn">
            <i class="fas fa-trash"></i>
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="toast-container" id="toastContainer"></div>

  <script type="module" src="js/admin/adminApp.js"></script>
</body>
</html>
```

### 2.2 Admin CSS Styling

| # | Task | Status | Notes |
|---|------|--------|-------|
| 2.1 | Style admin layout | TODO | Full-width with sidebar feel |
| 2.2 | Style admin header | TODO | Title + create button |
| 2.3 | Style stats cards | TODO | 3-column stat row |
| 2.4 | Style admin table | TODO | Responsive table |
| 2.5 | Style form modal | TODO | Two-column form layout |
| 2.6 | Style delete confirmation | TODO | Centered warning |

**Implementation - admin.css:**

```css
/* admin.css */

.admin-main {
  padding-top: calc(64px + var(--space-xl));
  min-height: 100vh;
}

.admin-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-md) var(--space-3xl);
}

/* Admin Header */
.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
}

.admin-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
}

.admin-subtitle {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-top: var(--space-xs);
}

/* Stats Cards */
.admin-stats {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
}

.stat-card {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-lg);
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
}

.stat-card i {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  background: var(--primary-light);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-xl);
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

/* Admin Table */
.admin-table-container {
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  overflow: hidden;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
}

.admin-table thead {
  background: var(--bg-tertiary);
}

.admin-table th,
.admin-table td {
  padding: var(--space-md) var(--space-lg);
  text-align: left;
}

.admin-table th {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid var(--border);
}

.admin-table tbody tr {
  border-bottom: 1px solid var(--border);
  transition: background var(--transition-fast);
}

.admin-table tbody tr:last-child {
  border-bottom: none;
}

.admin-table tbody tr:hover {
  background: var(--bg-secondary);
}

.admin-table td {
  font-size: var(--font-size-sm);
  color: var(--text-primary);
}

.event-cell {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.event-cell-image {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  object-fit: cover;
  background: var(--bg-tertiary);
}

.event-cell-info h4 {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  margin-bottom: 2px;
}

.event-cell-info span {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

.attendee-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-sm);
  background: var(--bg-tertiary);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

.attendee-badge i {
  color: var(--primary);
}

.action-buttons {
  display: flex;
  gap: var(--space-sm);
}

.action-btn {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: all var(--transition-fast);
}

.action-btn.edit:hover {
  background: var(--primary-light);
  color: var(--primary);
}

.action-btn.delete:hover {
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger);
}

/* No Events State */
.no-events-admin {
  text-align: center;
  padding: var(--space-3xl) var(--space-md);
  color: var(--text-muted);
}

.no-events-admin i {
  font-size: 48px;
  margin-bottom: var(--space-md);
  display: block;
  color: var(--primary-light);
}

.no-events-admin p {
  font-size: var(--font-size-lg);
  color: var(--text-secondary);
}

/* Form Modal */
.modal-form {
  max-width: 600px;
}

.modal-header-form {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-lg);
  border-bottom: 1px solid var(--border);
  background: var(--bg-primary);
}

.modal-header-form h2 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
}

.modal-form .modal-body {
  padding: var(--space-lg);
}

/* Form Styles */
.form-group {
  margin-bottom: var(--space-lg);
}

.form-group label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: var(--font-size-sm);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--border-focus);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.form-group select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%236B7280' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  cursor: pointer;
}

.form-hint {
  display: block;
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  margin-top: var(--space-xs);
}

.form-group.input-error input,
.form-group.input-error select,
.form-group.input-error textarea {
  border-color: var(--danger);
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-md);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-md);
  padding-top: var(--space-lg);
  border-top: 1px solid var(--border);
  margin-top: var(--space-lg);
}

/* Delete Confirmation Modal */
.modal-confirm {
  max-width: 400px;
  text-align: center;
}

.modal-confirm .modal-body {
  padding: var(--space-2xl);
}

.confirm-icon {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-full);
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-2xl);
  margin: 0 auto var(--space-lg);
}

.confirm-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
}

.confirm-message {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--space-xl);
}

.confirm-actions {
  display: flex;
  justify-content: center;
  gap: var(--space-md);
}

/* Responsive */
@media (min-width: 768px) {
  .admin-stats {
    grid-template-columns: repeat(3, 1fr);
  }

  .form-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 767px) {
  .admin-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .admin-table-container {
    overflow-x: auto;
  }

  .admin-table {
    min-width: 600px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
```

### 2.3 Admin JavaScript Logic

| # | Task | Status | Notes |
|---|------|--------|-------|
| 3.1 | Create `js/admin/adminApp.js` | TODO | Main admin initialization |
| 3.2 | Create `js/admin/eventTable.js` | TODO | Table rendering |
| 3.3 | Create `js/admin/eventForm.js` | TODO | Form handling |
| 3.4 | Create `js/admin/crud.js` | TODO | CRUD operations |
| 3.5 | Create `js/components/modal.js` | TODO | Generic modal component |

**Implementation - adminApp.js:**

```javascript
// js/admin/adminApp.js

import { initializeStore, getEvents, addEvent, updateEvent, deleteEvent } from '../state/store.js';
import { renderEventTable, updateStats } from './eventTable.js';
import { setupFormHandlers, resetForm, populateForm } from './eventForm.js';
import { initDarkMode } from '../features/darkMode.js';
import { showToast } from '../utils/helpers.js';

let eventToDelete = null;

function initAdmin() {
  // Initialize store
  initializeStore();

  // Initialize dark mode
  initDarkMode();

  // Render initial data
  renderTable();
  updateStatsDisplay();

  // Setup event handlers
  setupFormHandlers();
  setupDeleteHandlers();
  setupModalHandlers();

  // Listen for data changes
  window.addEventListener('eventsUpdated', () => {
    renderTable();
    updateStatsDisplay();
  });
}

function renderTable() {
  const events = getEvents();
  renderEventTable(events);
}

function updateStatsDisplay() {
  const events = getEvents();
  const totalAttendees = events.reduce((sum, e) => sum + e.attendees, 0);
  const categories = [...new Set(events.map(e => e.category))];

  document.getElementById('totalEvents').textContent = events.length;
  document.getElementById('totalAttendees').textContent = totalAttendees.toLocaleString();
  document.getElementById('totalCategories').textContent = categories.length;
}

function setupModalHandlers() {
  const createBtn = document.getElementById('createEventBtn');
  const formModal = document.getElementById('formModal');
  const deleteModal = document.getElementById('deleteModal');
  const closeFormBtn = document.getElementById('closeFormModal');
  const cancelFormBtn = document.getElementById('cancelFormBtn');
  const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

  // Open form modal for creating
  createBtn.addEventListener('click', () => {
    resetForm();
    document.getElementById('formModalTitle').textContent = 'Create New Event';
    formModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  });

  // Close form modal
  const closeFormModal = () => {
    formModal.style.display = 'none';
    document.body.style.overflow = '';
    resetForm();
  };

  closeFormBtn.addEventListener('click', closeFormModal);
  cancelFormBtn.addEventListener('click', closeFormModal);

  // Close delete modal
  const closeDeleteModal = () => {
    deleteModal.style.display = 'none';
    document.body.style.overflow = '';
    eventToDelete = null;
  };

  cancelDeleteBtn.addEventListener('click', closeDeleteModal);

  // Close modals on overlay click
  [formModal, deleteModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      }
    });
  });

  // Close modals on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (formModal.style.display === 'flex') {
        closeFormModal();
      }
      if (deleteModal.style.display === 'flex') {
        closeDeleteModal();
      }
    }
  });

  // Expose functions for table actions
  window.openEditModal = (eventId) => {
    const event = getEvents().find(e => e.id === Number(eventId));
    if (event) {
      populateForm(event);
      document.getElementById('formModalTitle').textContent = 'Edit Event';
      formModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  };

  window.openDeleteModal = (eventId, eventTitle) => {
    eventToDelete = eventId;
    document.getElementById('deleteEventTitle').textContent = eventTitle;
    deleteModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  };

  window.confirmDelete = () => {
    if (eventToDelete) {
      const result = deleteEvent(eventToDelete);
      if (result.success) {
        showToast('Event deleted successfully', 'success');
        closeDeleteModal();
      } else {
        showToast(result.error || 'Failed to delete event', 'error');
      }
    }
  };
}

function setupDeleteHandlers() {
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  confirmDeleteBtn.addEventListener('click', () => {
    window.confirmDelete();
  });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initAdmin);
```

**Implementation - eventTable.js:**

```javascript
// js/admin/eventTable.js

import { formatDate, getAttendeeText } from '../utils/helpers.js';

export function renderEventTable(events) {
  const tbody = document.getElementById('eventTableBody');
  const noEvents = document.getElementById('noEventsAdmin');
  const table = document.getElementById('eventTable');

  if (events.length === 0) {
    table.style.display = 'none';
    noEvents.style.display = 'block';
    return;
  }

  table.style.display = 'table';
  noEvents.style.display = 'none';

  tbody.innerHTML = events.map((event, index) => `
    <tr data-event-id="${event.id}">
      <td>${index + 1}</td>
      <td>
        <div class="event-cell">
          <img src="${event.imageUrl || ''}"
               alt="${event.title}"
               class="event-cell-image"
               onerror="this.style.display='none'">
          <div class="event-cell-info">
            <h4>${event.title}</h4>
            <span>${event.venue}</span>
          </div>
        </div>
      </td>
      <td>
        <span class="category-badge ${event.category.toLowerCase()}">
          ${event.category}
        </span>
      </td>
      <td>${formatDate(event.date)}</td>
      <td>
        <span class="attendee-badge">
          <i class="fas fa-users"></i>
          ${event.attendees}/${event.maxAttendees || '∞'}
        </span>
      </td>
      <td>
        <div class="action-buttons">
          <button class="action-btn edit"
                  onclick="openEditModal(${event.id})"
                  aria-label="Edit event"
                  title="Edit">
            <i class="fas fa-edit"></i>
          </button>
          <button class="action-btn delete"
                  onclick="openDeleteModal(${event.id}, '${event.title.replace(/'/g, "\\'")}')"
                  aria-label="Delete event"
                  title="Delete">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

export function updateStats() {
  // Stats are updated in adminApp.js
}
```

**Implementation - eventForm.js:**

```javascript
// js/admin/eventForm.js

import { addEvent, updateEvent } from '../state/store.js';
import { validateEventForm, showValidationErrors, clearValidationErrors } from '../utils/validators.js';
import { showToast } from '../utils/helpers.js';

const form = document.getElementById('eventForm');
let isEditing = false;
let editingEventId = null;

export function setupFormHandlers() {
  form.addEventListener('submit', handleSubmit);
}

export function resetForm() {
  form.reset();
  document.getElementById('eventId').value = '';
  clearValidationErrors(form);
  isEditing = false;
  editingEventId = null;
}

export function populateForm(event) {
  isEditing = true;
  editingEventId = event.id;

  document.getElementById('eventId').value = event.id;
  document.getElementById('eventTitle').value = event.title;
  document.getElementById('eventDescription').value = event.description;
  document.getElementById('eventCategory').value = event.category;
  document.getElementById('eventDate').value = event.date;
  document.getElementById('eventTime').value = event.time;
  document.getElementById('eventVenue').value = event.venue;
  document.getElementById('eventImageUrl').value = event.imageUrl || '';
  document.getElementById('eventMaxAttendees').value = event.maxAttendees;

  clearValidationErrors(form);
}

function handleSubmit(e) {
  e.preventDefault();

  const formData = {
    title: form.title.value.trim(),
    description: form.description.value.trim(),
    category: form.category.value,
    date: form.date.value,
    time: form.time.value,
    venue: form.venue.value.trim(),
    imageUrl: form.imageUrl.value.trim(),
    maxAttendees: parseInt(form.maxAttendees.value, 10)
  };

  // Validate
  const validation = validateEventForm(formData);

  if (!validation.isValid) {
    showValidationErrors(form, validation.errors);
    return;
  }

  clearValidationErrors(form);

  let result;

  if (isEditing && editingEventId) {
    // Update existing event
    result = updateEvent(editingEventId, formData);

    if (result.success) {
      showToast('Event updated successfully', 'success');
      closeFormModal();
    } else {
      showToast(result.error || 'Failed to update event', 'error');
    }
  } else {
    // Create new event
    result = addEvent(formData);

    if (result.success) {
      showToast('Event created successfully', 'success');
      closeFormModal();
    } else {
      showToast(result.error || 'Failed to create event', 'error');
    }
  }
}

function closeFormModal() {
  const modal = document.getElementById('formModal');
  modal.style.display = 'none';
  document.body.style.overflow = '';
  resetForm();
}
```

### 2.4 Generic Modal Component

| # | Task | Status | Notes |
|---|------|--------|-------|
| 4.1 | Create `js/components/modal.js` | TODO | Reusable modal |
| 4.2 | Implement open/close functions | TODO | With animation |
| 4.3 | Implement focus trap | TODO | Keyboard accessibility |
| 4.4 | Handle ESC key | TODO | Close on escape |

**Implementation - modal.js:**

```javascript
// js/components/modal.js

export function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  // Focus first focusable element
  setTimeout(() => {
    const firstFocusable = modal.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (firstFocusable) firstFocusable.focus();
  }, 100);

  // Setup focus trap
  setupFocusTrap(modal);
}

export function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.style.display = 'none';
  document.body.style.overflow = '';
}

function setupFocusTrap(modal) {
  const focusableElements = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  if (focusableElements.length === 0) return;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  modal.addEventListener('keydown', function trapHandler(e) {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }

    // Remove handler when modal closes
    if (modal.style.display === 'none') {
      modal.removeEventListener('keydown', trapHandler);
    }
  });
}
```

---

## 3. Critical Bug Areas

### 3.1 Form Submission Without Validation
**Risk:** Invalid data saved to LocalStorage if validation is bypassed.

**Fix:**
```javascript
function handleSubmit(e) {
  e.preventDefault(); // Always prevent default

  const formData = getFormData();
  const validation = validateEventForm(formData);

  if (!validation.isValid) {
    showValidationErrors(form, validation.errors);
    return; // Stop submission
  }

  // Only proceed if valid
  saveEvent(formData);
}
```

### 3.2 Event ID Not Preserved on Edit
**Risk:** Editing an event creates a new event instead of updating.

**Fix:**
```javascript
// Store the ID being edited
let editingEventId = null;

function populateForm(event) {
  editingEventId = event.id;
  document.getElementById('eventId').value = event.id;
  // ... populate other fields
}

function handleSubmit(e) {
  if (editingEventId) {
    updateEvent(editingEventId, formData);
  } else {
    addEvent(formData);
  }
}
```

### 3.3 XSS in Table Rendering
**Risk:** User input with HTML/JS renders as code.

**Fix:**
```javascript
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Use in table rendering
`<h4>${escapeHtml(event.title)}</h4>`
```

### 3.4 Delete Without Confirmation
**Risk:** Events accidentally deleted without user confirmation.

**Fix:**
- Always show confirmation modal
- Never delete directly on button click
- Use two-step confirmation for critical actions

### 3.5 Form Not Reset After Create
**Risk:** Old data appears in form when creating new event after edit.

**Fix:**
```javascript
function resetForm() {
  form.reset();
  document.getElementById('eventId').value = '';
  isEditing = false;
  editingEventId = null;
  clearValidationErrors(form);
}

// Call resetForm when opening for new event
createBtn.addEventListener('click', () => {
  resetForm();
  openModal('formModal');
});
```

### 3.6 Table Not Updating After CRUD
**Risk:** Table shows stale data after create/update/delete.

**Fix:**
```javascript
// Dispatch event after any CRUD operation
function addEvent(data) {
  // ... save logic
  window.dispatchEvent(new CustomEvent('eventsUpdated'));
}

// Listen in adminApp
window.addEventListener('eventsUpdated', () => {
  renderTable();
  updateStatsDisplay();
});
```

### 3.7 Modal Overlay Click Not Closing
**Risk:** Clicking outside modal doesn't close it.

**Fix:**
```javascript
modal.addEventListener('click', (e) => {
  if (e.target === modal) { // Clicked on overlay, not modal content
    closeModal(modal.id);
  }
});
```

### 3.8 Date Input Format Issues
**Risk:** Date input returns different formats across browsers.

**Fix:**
```javascript
// Use date input which returns YYYY-MM-DD
<input type="date" name="date">

// When reading
const date = form.date.value; // Already in YYYY-MM-DD format
```

### 3.9 Max Attendees Validation
**Risk:** Negative numbers or zero accepted as max attendees.

**Fix:**
```javascript
// In validator
if (isNaN(maxAttendees) || maxAttendees < 1) {
  errors.maxAttendees = 'Must be at least 1';
}
```

### 3.10 Image URL Not Validated
**Risk:** Invalid URLs cause broken images.

**Fix:**
```javascript
// Optional but validate if provided
if (formData.imageUrl && formData.imageUrl.trim() !== '') {
  try {
    new URL(formData.imageUrl);
  } catch {
    errors.imageUrl = 'Please enter a valid URL';
  }
}
```

### 3.11 Table Overflow on Mobile
**Risk:** Table wider than screen on mobile.

**Fix:**
```css
@media (max-width: 767px) {
  .admin-table-container {
    overflow-x: auto;
  }

  .admin-table {
    min-width: 600px;
  }
}
```

### 3.12 Form Fields Not Accessible
**Risk:** Screen readers can't associate labels with inputs.

**Fix:**
```html
<label for="eventTitle">Event Title *</label>
<input type="text" id="eventTitle" name="title" required>
```

---

## 4. CRUD Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    ADMIN CRUD OPERATIONS                         │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                     CREATE                                │   │
│  │  Click "Create New Event"                                 │   │
│  │       │                                                   │   │
│  │       ▼                                                   │   │
│  │  Open Form Modal (empty)                                  │   │
│  │       │                                                   │   │
│  │       ▼                                                   │   │
│  │  Fill Form → Validate                                     │   │
│  │       │                                                   │   │
│  │       ▼                                                   │   │
│  │  Invalid? → Show Errors ←──────────┐                     │   │
│  │       │                            │                     │   │
│  │       ▼ (Valid)                    │                     │   │
│  │  Add to LocalStorage               │                     │   │
│  │       │                            │                     │   │
│  │       ▼                            │                     │   │
│  │  Close Modal                       │                     │   │
│  │       │                            │                     │   │
│  │       ▼                            │                     │   │
│  │  Re-render Table                   │                     │   │
│  │       │                            │                     │   │
│  │       ▼                            │                     │   │
│  │  Show Success Toast ───────────────┘                     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                      READ                                 │   │
│  │  Page Load → Get Events from LocalStorage                │   │
│  │       │                                                   │   │
│  │       ▼                                                   │   │
│  │  Render Table with Event Data                             │   │
│  │       │                                                   │   │
│  │       ▼                                                   │   │
│  │  Display Stats (total events, attendees, categories)      │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                     UPDATE                                │   │
│  │  Click "Edit" on Event Row                                │   │
│  │       │                                                   │   │
│  │       ▼                                                   │   │
│  │  Open Form Modal (pre-populated)                          │   │
│  │       │                                                   │   │
│  │       ▼                                                   │   │
│  │  Modify Fields → Validate                                 │   │
│  │       │                                                   │   │
│  │       ▼                                                   │   │
│  │  Update LocalStorage (preserve ID and attendees)          │   │
│  │       │                                                   │   │
│  │       ▼                                                   │   │
│  │  Close Modal → Re-render → Success Toast                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                     DELETE                                │   │
│  │  Click "Delete" on Event Row                              │   │
│  │       │                                                   │   │
│  │       ▼                                                   │   │
│  │  Open Confirmation Modal                                  │   │
│  │       │                                                   │   │
│  │       ├──── Cancel ──→ Close Modal (no action)            │   │
│  │       │                                                   │   │
│  │       └──── Confirm ──→ Remove from LocalStorage          │   │
│  │                            │                              │   │
│  │                            ▼                              │   │
│  │                    Re-render Table                        │   │
│  │                            │                              │   │
│  │                            ▼                              │   │
│  │                    Success Toast                          │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. Git Workflow

```bash
# Branch
git checkout -b feat/admin-dashboard
git checkout -b feat/admin-form
git checkout -b feat/admin-table
git checkout -b feat/admin-crud

# Commits
git commit -m "feat(admin): create admin dashboard HTML structure"
git commit -m "feat(admin): style admin table with responsive layout"
git commit -m "feat(admin): implement event form with validation"
git commit -m "feat(admin): add create event functionality"
git commit -m "feat(admin): add edit event functionality"
git commit -m "feat(admin): add delete event with confirmation"
git commit -m "feat(admin): add stats cards showing totals"
git commit -m "fix(admin): resolve form not resetting after create"
git commit -m "fix(admin): escape HTML in table to prevent XSS"
```

---

## 6. Testing Checklist

### CRUD Operations

- [ ] Create new event with valid data
- [ ] Create event shows validation errors for empty title
- [ ] Create event shows validation errors for invalid date
- [ ] Create event shows validation errors for maxAttendees < 1
- [ ] Create event updates table immediately
- [ ] Create event shows success toast
- [ ] Edit existing event pre-populates form
- [ ] Edit event saves changes correctly
- [ ] Edit event preserves attendee count
- [ ] Delete event shows confirmation modal
- [ ] Delete event removes from table
- [ ] Cancel delete does not remove event

### Form Validation

- [ ] Title: min 3 characters required
- [ ] Description: min 10 characters required
- [ ] Category: must select from dropdown
- [ ] Date: valid format required
- [ ] Time: valid format required
- [ ] Venue: min 3 characters required
- [ ] Image URL: valid URL if provided
- [ ] Max Attendees: must be >= 1
- [ ] Error messages display correctly
- [ ] Errors clear on valid input

### UI/UX

- [ ] Table responsive on mobile (scrollable)
- [ ] Modal opens/closes correctly
- [ ] Modal closes on overlay click
- [ ] Modal closes on ESC key
- [ ] Focus trap works in modal
- [ ] Dark mode works on admin page
- [ ] Stats update after CRUD operations
- [ ] Empty state shows when no events

### Edge Cases

- [ ] Rapid create/delete operations
- [ ] Very long event title (display)
- [ ] Special characters in title/description
- [ ] Maximum events in LocalStorage

---

## 7. Responsive Behavior

| Breakpoint | Layout Changes |
|-----------|----------------|
| < 768px | Stats stack vertically, table scrollable, form single column |
| 768-1024px | Stats 3-column, table full width, form 2-column |
| > 1024px | Stats 3-column, table with comfortable spacing, form 2-column |

---

*This document covers the complete admin dashboard and CRUD operations implementation for the Event Listing and Registration Platform project.*
