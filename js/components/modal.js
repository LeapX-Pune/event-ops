// js/components/modal.js — Generic accessible modal utility

/**
 * Open a modal by its element ID.
 * Focuses the first focusable element and sets up a focus trap.
 * @param {string} modalId
 */
export function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Focus first focusable element after animation
  setTimeout(() => {
    const focusable = getFocusable(modal);
    const first = focusable[0];
    if (first) first.focus();
  }, 100);

  setupFocusTrap(modal);
}

/**
 * Close a modal by its element ID.
 * @param {string} modalId
 */
export function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.classList.remove('open');
  document.body.style.overflow = '';
}

// ─────────────────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────────────────

const FOCUSABLE_SELECTORS =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusable(modal) {
  return Array.from(modal.querySelectorAll(FOCUSABLE_SELECTORS));
}

function setupFocusTrap(modal) {
  const handler = (e) => {
    if (e.key !== 'Tab') return;

    // Remove trap if modal has been closed
    if (!modal.classList.contains('open')) {
      modal.removeEventListener('keydown', handler);
      return;
    }

    const focusable = getFocusable(modal);
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        last.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    }
  };

  // Remove any existing handler to avoid duplicates
  modal.removeEventListener('keydown', modal._focusTrapHandler);
  modal._focusTrapHandler = handler;
  modal.addEventListener('keydown', handler);
}
