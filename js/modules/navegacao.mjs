export function iniciarNavegacao() {
"use strict";
const navToggle = document.querySelector('.nav-toggle');
const primaryNav = document.getElementById('navegacao');
const dropdown = document.querySelector('.nav-dropdown');
if (navToggle && primaryNav && dropdown) {
  const summary = dropdown.querySelector('summary');
  const desktop = matchMedia('(min-width: 768px)');
  const closeMenu = (restoreFocus = false) => {
    const focusInside = primaryNav.contains(document.activeElement);
    primaryNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menu');
    dropdown.open = false;
    if (restoreFocus && !desktop.matches && focusInside) navToggle.focus();
  };
  navToggle.addEventListener('click', () => {
    const opened = primaryNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(opened));
    navToggle.setAttribute('aria-label', opened ? 'Fechar menu' : 'Abrir menu');
    if (!opened) dropdown.open = false;
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (dropdown.open) {
      dropdown.open = false;
      summary.focus();
    } else if (primaryNav.classList.contains('is-open')) {
      closeMenu();
      navToggle.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!dropdown.contains(event.target)) dropdown.open = false;
    if (!primaryNav.contains(event.target) && !navToggle.contains(event.target)) closeMenu(true);
  });
  dropdown.addEventListener('focusout', event => {
    if (!dropdown.contains(event.relatedTarget)) dropdown.open = false;
  });
  primaryNav.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
  });
  desktop.addEventListener('change', () => closeMenu(true));
  document.documentElement.classList.add('js');
  navToggle.hidden = false;
}

}
