// js/admin/eventForm.js — Create & Edit form handling

import { addEvent, updateEvent } from './crud.js';

let isEditing = false;
let editingEventId = null;

const form = document.getElementById('event-form');
const modalTitle = document.getElementById('modal-title');
const submitBtn = document.getElementById('modal-submit');

// --- Image Upload elements ---
const dropZone = document.getElementById('image-upload-zone');
const fileInput = document.getElementById('form-image-file');
const previewContainer = document.getElementById('image-preview-container');
const previewImage = document.getElementById('image-preview');
const removeBtn = document.getElementById('remove-image-btn');
const urlInput = document.getElementById('form-image');
const imageDataInput = document.getElementById('form-image-data');

// --- Itinerary elements ---
const itineraryContainer = document.getElementById('itinerary-items-container');
const addItineraryBtn = document.getElementById('add-itinerary-btn');

let draggedItem = null;

export function setupFormHandlers(onSuccess) {
  if (!form) return;

  // --- Image Upload Handlers ---
  if (dropZone) {
    dropZone.addEventListener('click', () => fileInput.click());
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.style.borderColor = 'var(--gold)';
      dropZone.style.background = 'rgba(230,198,135,0.1)';
    });
    dropZone.addEventListener('dragleave', () => {
      dropZone.style.borderColor = 'rgba(255,255,255,0.2)';
      dropZone.style.background = 'rgba(0,0,0,0.2)';
    });
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.style.borderColor = 'rgba(255,255,255,0.2)';
      dropZone.style.background = 'rgba(0,0,0,0.2)';
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFile(e.dataTransfer.files[0]);
      }
    });
  }

  if (fileInput) {
    fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));
  }

  if (removeBtn) {
    removeBtn.addEventListener('click', () => {
      if (fileInput) fileInput.value = '';
      if (imageDataInput) imageDataInput.value = '';
      if (previewImage) previewImage.src = '';
      if (previewContainer) previewContainer.style.display = 'none';
      if (dropZone) dropZone.style.display = 'block';
    });
  }

  if (urlInput) {
    urlInput.addEventListener('input', () => {
      if (urlInput.value.trim() !== '') {
        removeBtn.click();
      }
    });
  }

  // --- Itinerary Handlers ---
  if (addItineraryBtn) {
    addItineraryBtn.addEventListener('click', () => addItineraryItem());
  }

  // --- Submit Handler ---
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) return;

    const eventId = document.getElementById('form-event-id').value;

    let itineraryArray = [];
    const itineraryBlocks = itineraryContainer.querySelectorAll('.itinerary-input-block');
    itineraryBlocks.forEach((block, idx) => {
      let num = block.querySelector('.itinerary-num-display').textContent.trim();
      let title = block.querySelector('.itinerary-title-input').value.trim();
      let desc = block.querySelector('.itinerary-desc-input').value.trim();
      if (title || desc) {
        if (!num) num = String(idx + 1).padStart(2, '0');
        itineraryArray.push({ num, title, desc });
      }
    });

    const eventData = {
      id: eventId || 'custom_' + Date.now(),
      title: document.getElementById('form-title').value.trim(),
      description: document.getElementById('form-description').value.trim(),
      itinerary: itineraryArray,
      category: document.getElementById('form-category').value,
      date: document.getElementById('form-date').value,
      time: document.getElementById('form-time').value || '12:00 PM',
      capacity: parseInt(document.getElementById('form-capacity').value, 10),
      location: document.getElementById('form-location').value.trim(),
      price: document.getElementById('form-price').value.trim() || 'Free',
      duration: document.getElementById('form-duration').value.trim() || 'TBD',
      difficulty: document.getElementById('form-difficulty').value || 'All Levels',
      image: document.getElementById('form-image-data').value || document.getElementById('form-image').value.trim() || ''
    };

    let result;
    if (eventId) {
      result = updateEvent(eventId, eventData);
      if (result.success) {
        if (typeof window.showToast === 'function') window.showToast('Event updated successfully.', 'success');
      }
    } else {
      result = addEvent(eventData);
      if (result.success) {
        if (typeof window.showToast === 'function') window.showToast('Event created successfully!', 'success');
      }
    }

    if (result && result.success) {
      onSuccess();
    }
  });
}

function handleFile(file) {
  if (file && file.type.startsWith('image/')) {
    if (file.size > 5 * 1024 * 1024) {
      if (typeof window.showToast === 'function') window.showToast('File size must be under 5MB.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      imageDataInput.value = e.target.result;
      previewImage.src = e.target.result;
      dropZone.style.display = 'none';
      previewContainer.style.display = 'block';
      urlInput.value = '';
    };
    reader.readAsDataURL(file);
  } else {
    if (typeof window.showToast === 'function') window.showToast('Please upload a valid image file.', 'error');
  }
}

export function resetForm() {
  if (!form) return;
  form.reset();
  document.getElementById('form-event-id').value = '';
  if (removeBtn) removeBtn.click();
  if (itineraryContainer) {
    itineraryContainer.innerHTML = '';
    addItineraryItem('01', '', '');
  }
  clearValidation();
  isEditing = false;
  editingEventId = null;
}

export function populateForm(event) {
  if (!form || !event) return;

  isEditing = true;
  editingEventId = event.id;

  document.getElementById('form-event-id').value = event.id;
  document.getElementById('form-title').value = event.title;
  document.getElementById('form-description').value = event.description || '';

  if (itineraryContainer) {
    itineraryContainer.innerHTML = '';
    if (Array.isArray(event.itinerary) && event.itinerary.length > 0) {
      event.itinerary.forEach(item => {
        addItineraryItem(item.num, item.title, item.desc);
      });
    } else {
      addItineraryItem('01', '', '');
    }
  }

  document.getElementById('form-category').value = event.category;
  document.getElementById('form-date').value = event.date;
  document.getElementById('form-time').value = event.time || '';
  document.getElementById('form-capacity').value = event.capacity;
  document.getElementById('form-location').value = event.location;
  document.getElementById('form-price').value = event.price !== 'Free' ? event.price : '';
  document.getElementById('form-duration').value = event.duration || '';
  document.getElementById('form-difficulty').value = event.difficulty || 'All Levels';

  if (removeBtn) removeBtn.click();
  if (event.image && event.image.startsWith('data:image')) {
    imageDataInput.value = event.image;
    previewImage.src = event.image;
    dropZone.style.display = 'none';
    previewContainer.style.display = 'block';
  } else {
    document.getElementById('form-image').value = event.image || '';
  }

  clearValidation();
}

function updateItineraryNumbers() {
  if (!itineraryContainer) return;
  const blocks = itineraryContainer.querySelectorAll('.itinerary-input-block');
  blocks.forEach((block, index) => {
    const numDisplay = block.querySelector('.itinerary-num-display');
    if (numDisplay) {
      numDisplay.textContent = String(index + 1).padStart(2, '0');
    }
  });
}

export function addItineraryItem(num = '', title = '', desc = '') {
  if (!itineraryContainer) return;
  const div = document.createElement('div');
  div.className = 'itinerary-input-block';
  div.draggable = true;
  div.style.background = 'rgba(255,255,255,0.02)';
  div.style.border = '1px solid rgba(255,255,255,0.1)';
  div.style.padding = '12px';
  div.style.borderRadius = '8px';
  div.style.display = 'grid';
  div.style.gap = '8px';
  div.style.position = 'relative';
  div.style.cursor = 'grab';

  div.innerHTML = `
    <button type="button" class="remove-itinerary-btn material-symbols-outlined" style="position:absolute; top:8px; right:8px; background:none; border:none; color:var(--text-secondary); cursor:pointer; font-size:18px; z-index: 10;">close</button>
    <div style="display:grid; grid-template-columns: 24px 30px 1fr; gap:8px; align-items:center;">
      <span class="material-symbols-outlined drag-handle" style="color:var(--text-secondary); font-size: 20px;">drag_indicator</span>
      <div class="itinerary-num-display" style="font-weight:600; font-size:16px; color:var(--gold); text-align:center;">${num}</div>
      <input type="text" class="form-input itinerary-title-input" placeholder="Heading (e.g. The Masterclass)" value="${title}" style="padding:8px;" />
    </div>
    <textarea class="form-input itinerary-desc-input" rows="2" placeholder="Description..." style="resize:vertical; padding:8px; margin-top:4px;">${desc}</textarea>
  `;

  div.querySelector('.remove-itinerary-btn').addEventListener('click', () => {
    div.remove();
    updateItineraryNumbers();
  });

  div.addEventListener('dragstart', (e) => {
    draggedItem = div;
    e.dataTransfer.effectAllowed = 'move';
    div.style.opacity = '0.5';
  });
  div.addEventListener('dragend', () => {
    draggedItem = null;
    div.style.opacity = '1';
  });
  div.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  });
  div.addEventListener('drop', (e) => {
    e.preventDefault();
    if (draggedItem && draggedItem !== div) {
      const allItems = Array.from(itineraryContainer.querySelectorAll('.itinerary-input-block'));
      const draggedIndex = allItems.indexOf(draggedItem);
      const dropIndex = allItems.indexOf(div);

      if (draggedIndex < dropIndex) {
        div.after(draggedItem);
      } else {
        div.before(draggedItem);
      }
      updateItineraryNumbers();
    }
  });

  itineraryContainer.appendChild(div);
  updateItineraryNumbers();
}

function clearValidation() {
  document.querySelectorAll('.validation-error').forEach(el => el.style.display = 'none');
  document.querySelectorAll('.form-input.error').forEach(el => el.classList.remove('error'));
}

function validate() {
  clearValidation();
  let valid = true;

  const title = document.getElementById('form-title');
  const category = document.getElementById('form-category');
  const date = document.getElementById('form-date');
  const capacity = document.getElementById('form-capacity');
  const location = document.getElementById('form-location');

  if (!title.value.trim()) {
    title.classList.add('error');
    document.getElementById('err-title').style.display = 'block';
    valid = false;
  }
  if (!category.value) {
    category.classList.add('error');
    document.getElementById('err-category').style.display = 'block';
    valid = false;
  }
  if (!date.value) {
    date.classList.add('error');
    document.getElementById('err-date').style.display = 'block';
    valid = false;
  }
  if (!capacity.value || parseInt(capacity.value, 10) < 1) {
    capacity.classList.add('error');
    document.getElementById('err-capacity').style.display = 'block';
    valid = false;
  }
  if (!location.value.trim()) {
    location.classList.add('error');
    document.getElementById('err-location').style.display = 'block';
    valid = false;
  }

  return valid;
}
