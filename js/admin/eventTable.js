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

  if (events.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center; padding: 48px; color: var(--text-secondary); font-family: var(--font-body);">
          <span class="material-symbols-outlined" style="font-size: 48px; display:block; margin-bottom:12px; color:rgba(255,255,255,0.1);">explore</span>
          No events found. Click "New Event" to create one.
        </td>
      </tr>
    `;
    return;
  }

  events.forEach(evt => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="title-cell">
        <div style="display:flex; align-items:center; gap:12px;">
          <div class="event-thumb" style="width:36px; height:36px; border-radius:6px; overflow:hidden; background:rgba(255,255,255,0.05); flex-shrink:0;">
            ${evt.image ? `<img src="${evt.image}" style="width:100%; height:100%; object-fit:cover;" />` : `<span class="material-symbols-outlined" style="font-size:20px; display:flex; align-items:center; justify-content:center; height:100%; color:var(--text-secondary);">image</span>`}
          </div>
          <span style="white-space:normal; word-break:break-word; max-width:240px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${escapeHtml(evt.title)}</span>
        </div>
      </td>
      <td>
        <span class="category-badge ${evt.category}">${escapeHtml(evt.categoryName || evt.category)}</span>
      </td>
      <td>${escapeHtml(evt.date)}</td>
      <td>${escapeHtml(evt.location)}</td>
      <td>${evt.capacity || evt.maxAttendees || 0}</td>
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
