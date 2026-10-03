export function iniciarFeedback() {
"use strict";
const infoDialog = document.getElementById('sobre-demo');
const openDialog = document.querySelector('[data-open-dialog]');
const toast = document.getElementById('toast-demo');
let toastTimer;
function fecharToast() {
  clearTimeout(toastTimer);
  if (toast) toast.hidden = true;
}
function agendarToast() {
  clearTimeout(toastTimer);
  if (toast && !toast.contains(document.activeElement)) toastTimer = setTimeout(fecharToast,8000);
}
function mostrarToast(message) {
  if (!toast) return;
  clearTimeout(toastTimer);
  toast.hidden = false;
  document.getElementById('toast-mensagem').textContent = message;
  agendarToast();
}
if (toast) {
  toast.querySelector('button').addEventListener('click',fecharToast);
  toast.addEventListener('mouseenter', () => clearTimeout(toastTimer));
  toast.addEventListener('mouseleave',agendarToast);
  toast.addEventListener('focusin', () => clearTimeout(toastTimer));
  toast.addEventListener('focusout',agendarToast);
}
if (infoDialog && openDialog) {
  openDialog.addEventListener('click', () => infoDialog.showModal());
  infoDialog.querySelectorAll('[data-close-dialog]').forEach(button => button.addEventListener('click', () => infoDialog.close()));
  infoDialog.addEventListener('close', () => openDialog.focus());
  infoDialog.addEventListener('click',event => {
    const box = infoDialog.getBoundingClientRect();
    if (event.target === infoDialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) infoDialog.close();
  });
  openDialog.hidden = false;
}

return {mostrarToast,fecharToast};
}
