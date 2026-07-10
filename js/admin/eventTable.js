// js/admin/eventTable.js — Render admin events table (Conclave design)

import { escapeHtml, formatDate, formatTime } from '../utils/helpers.js';

/**
 * Render events into #eventTableBody.
 * @param {Array}  events
 * @param {string} [query]  live-search filter
 */
export function renderEventTable(events, query = '') {
  const tbody    = document.getElementById('eventTableBody');
  const noEvents = document.getElementById('noEventsAdmin');
  const table    = document.getElementById('eventTable');

  if (!tbody || !noEvents || !table) return;

  const filtered = query.trim()
    ? events.filter(e =>
        e.title.toLowerCase().includes(query.toLowerCase()) ||
        e.venue.toLowerCase().includes(query.toLowerCase()) ||
        e.category.toLowerCase().includes(query.toLowerCase())
      )
    : events;

  if (filtered.length === 0) {
    table.style.display = 'none';
    noEvents.style.display = 'block';
    return;
  }

  table.style.display = '';
  noEvents.style.display = 'none';

  tbody.innerHTML = filtered.map((event, idx) => {
    const hasImage = event.imageUrl && event.imageUrl.trim();
    const thumbHtml = hasImage
      ? `<img src="${escapeHtml(event.imageUrl)}"
              alt="${escapeHtml(event.title)}"
              class="ev-thumb"
              loading="lazy"
              onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
      : '';
    const placeholderStyle = hasImage ? 'style="display:none"' : '';

    return `
    <tr data-event-id="${event.id}">
      <td><span class="row-num">${idx + 1}</span></td>
      <td>
        <div class="ev-cell">
          ${thumbHtml}
          <div class="ev-thumb-placeholder" ${placeholderStyle}>
            <span class="material-symbols-outlined">event</span>
          </div>
          <div>
            <div class="ev-info-name" title="${escapeHtml(event.title)}">${escapeHtml(event.title)}</div>
            <div class="ev-info-venue">
              <span class="material-symbols-outlined">location_on</span>
              ${escapeHtml(event.venue)}
            </div>
          </div>
        </div>
      </td>
      <td><span class="cat-badge">${escapeHtml(event.category)}</span></td>
      <td>
        <div class="ev-date-main">${formatDate(event.date)}</div>
        <div class="ev-date-time">${formatTime(event.time)}</div>
      </td>
      <td>
        <span class="att-badge">
          <span class="material-symbols-outlined">group</span>
          ${event.attendees} / ${event.maxAttendees ?? '∞'}
        </span>
      </td>
      <td>
        <div class="row-actions">
          <button class="act-btn edit"
                  onclick="window.openEditModal(${event.id})"
                  aria-label="Edit ${escapeHtml(event.title)}"
                  title="Edit">
            <span class="material-symbols-outlined">edit</span>
          </button>
          <button class="act-btn delete"
                  onclick="window.openDeleteModal(${event.id}, '${event.title.replace(/'/g, "\\'")}')"
                  aria-label="Delete ${escapeHtml(event.title)}"
                  title="Delete">
            <span class="material-symbols-outlined">delete</span>
          </button>
        </div>
      </td>
    </tr>`;
  }).join('');
}

/**
 * Update the 3 stat counters.
 * @param {Array} events
 */
export function updateStats(events) {
  const evEl  = document.getElementById('totalEvents');
  const attEl = document.getElementById('totalAttendees');
  const catEl = document.getElementById('totalCategories');

  if (evEl)  evEl.textContent  = events.length;
  if (attEl) attEl.textContent = events.reduce((s, e) => s + (e.attendees || 0), 0).toLocaleString();
  if (catEl) catEl.textContent = new Set(events.map(e => e.category)).size;
}
