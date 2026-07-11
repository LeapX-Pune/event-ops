// js/admin/eventTable.js — Render admin events table (Conclave design)

/**
 * Render events into #admin-table-body.
 * @param {Array}    events
 * @param {Function} onEdit    Callback when edit button is clicked
 * @param {Function} onDelete  Callback when delete button is clicked
 */
export function renderEventTable(events, onEdit, onDelete) {
  const tbody = document.getElementById('admin-table-body');
  if (!tbody) return;

  tbody.innerHTML = '';

  events.forEach(evt => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="title-cell">${escapeHtml(evt.title)}</td>
      <td>${escapeHtml(evt.category)}</td>
      <td>${escapeHtml(evt.date)}</td>
      <td>${escapeHtml(evt.location)}</td>
      <td>${evt.capacity}</td>
      <td style="text-align:right;white-space:nowrap;">
        <button class="admin-action-btn edit-btn" data-id="${evt.id}" ${evt.builtIn ? 'disabled title="Built-in events cannot be edited"' : ''}>
          <span class="material-symbols-outlined">edit</span>
        </button>
        <button class="admin-action-btn delete delete-btn" data-id="${evt.id}" ${evt.builtIn ? 'disabled title="Built-in events cannot be deleted"' : ''}>
          <span class="material-symbols-outlined">delete</span>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll('.edit-btn:not([disabled])').forEach(btn => {
    btn.addEventListener('click', () => onEdit(btn.dataset.id));
  });

  tbody.querySelectorAll('.delete-btn:not([disabled])').forEach(btn => {
    btn.addEventListener('click', () => onDelete(btn.dataset.id));
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
