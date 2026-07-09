// js/features/darkMode.js — Dark/light theme toggle

const THEME_KEY = 'eventhub_theme';

/**
 * Initialise dark mode from persisted preference or system preference.
 * Wires up the #themeToggle button.
 */
export function initDarkMode() {
  const saved  = localStorage.getItem(THEME_KEY);
  const prefer = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme  = saved || (prefer ? 'dark' : 'light');

  applyTheme(theme);

  const btn = document.getElementById('themeToggle');
  if (btn) {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);

  const icon = document.querySelector('#themeToggle i');
  if (icon) {
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }
}
