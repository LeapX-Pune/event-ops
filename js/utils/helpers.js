// js/utils/helpers.js — Shared utility functions

/**
 * Format an ISO date string (YYYY-MM-DD) to a human-friendly display.
 * @param {string} dateStr  e.g. "2025-08-15"
 * @returns {string}        e.g. "Aug 15, 2025"
 */
export function formatDate(dateStr) {
  if (!dateStr) return '—';
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day:   'numeric',
    year:  'numeric',
  });
}

/**
 * Format a time string (HH:MM) to 12-hour AM/PM format.
 * @param {string} timeStr  e.g. "14:30"
 * @returns {string}        e.g. "2:30 PM"
 */
export function formatTime(timeStr) {
  if (!timeStr) return '—';
  const [hour, minute] = timeStr.split(':').map(Number);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h = hour % 12 || 12;
  return `${h}:${minute.toString().padStart(2, '0')} ${ampm}`;
}

/**
 * Return a human-friendly attendee count label.
 * @param {number} current
 * @param {number} max
 * @returns {string}
 */
export function getAttendeeText(current, max) {
  if (!max) return `${current} registered`;
  return `${current} / ${max}`;
}

/**
 * Escape HTML to prevent XSS when inserting user content into innerHTML.
 * @param {string} str
 * @returns {string}
 */
export function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}

/**
 * Show a toast notification (Conclave design system).
 * @param {string} message
 * @param {'success'|'error'|'info'} type
 * @param {number} [duration=3500]
 */
export function showToast(message, type = 'info', duration = 3500) {
  const container = document.getElementById('toast-root');
  if (!container) return;

  const iconMap = {
    success: 'check_circle',
    error:   'cancel',
    info:    'info',
  };

  const toast = document.createElement('div');
  toast.className = `toast-note toast-${type}`;
  toast.setAttribute('role', 'alert');
  toast.innerHTML = `
    <span class="material-symbols-outlined">${iconMap[type] || 'info'}</span>
    <span>${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);

  const remove = () => {
    toast.classList.add('hiding');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  };

  const timer = setTimeout(remove, duration);
  toast.addEventListener('click', () => { clearTimeout(timer); remove(); });
}

/**
 * Generate a simple unique ID (timestamp + random).
 * @returns {number}
 */
export function generateId() {
  return Date.now() + Math.floor(Math.random() * 10000);
}
