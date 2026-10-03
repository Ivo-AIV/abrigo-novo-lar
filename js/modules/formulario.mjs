import {formatCPF,formatPhone,formatCEP,validCPF} from './mascaras.mjs';
"use strict";
// Demonstração local. Os dados não são enviados ou armazenados.
export function iniciarFormulario(form, {storage,mostrarToast,fecharToast}) {
if (form) {
  const saved=storage.lerPreferencias();
  const preferenceStatus=form.querySelector('#preferencias-status');
  const remember=form.querySelector('#lembrar-preferencias');
  if (saved.valor) {
    form.querySelector('[name="perfil"][value="'+saved.valor.perfil+'"]').checked=true;
    form.querySelector('#interesse').value=saved.valor.interesse;
    remember.checked=true;
    preferenceStatus.textContent='Suas preferências de apoio foram recuperadas deste navegador.';
  } else if (!saved.ok) preferenceStatus.textContent='Não foi possível recuperar as preferências. Você pode continuar preenchendo normalmente.';
  form.querySelector('#esquecer-preferencias').addEventListener('click',()=>{
    const cleared=storage.limparPreferencias();
    remember.checked=false;
    preferenceStatus.textContent=cleared.ok ? 'As preferências salvas foram removidas deste navegador.' : 'Não foi possível remover as preferências. Verifique a configuração do navegador.';
  });
  const cpf = document.getElementById('cpf');
  const result = document.getElementById('resultado');
  const birthday = document.getElementById('nascimento');
  const errorSummary = document.getElementById('erros-cadastro');
  const controls = Array.from(form.querySelectorAll('input, select, textarea'));
  const requiredText = controls.filter(control => control.required && control.type === 'text' && control.inputMode !== 'numeric');
  const validateText = control => control.setCustomValidity(control.value && !control.value.trim() ? 'Preencha este campo com um texto, além dos espaços.' : '');
  requiredText.forEach(control => control.addEventListener('input', () => validateText(control)));
  const descriptions = new Map(controls.map(control => [control, control.getAttribute('aria-describedby') || '']));
  const messages = new Map();
  let attempted = false;
  const today = new Date();
  birthday.max = today.getFullYear()+'-'+String(today.getMonth()+1).padStart(2,'0')+'-'+String(today.getDate()).padStart(2,'0');
  controls.forEach((control,index) => { if (!control.id) control.id = control.name+'-'+index; });
  const groupFor = control => control.type === 'radio' ? controls.filter(other => other.name === control.name) : [control];
  const invalidFor = control => control.type === 'radio' ? !groupFor(control).some(other => other.checked) : !control.validity.valid;
  const valuePresent = control => control.type === 'radio' ? groupFor(control).some(other => other.checked) : control.type === 'checkbox' ? control.checked : Boolean(control.value.trim());
  const renderControl = control => {
    const group = groupFor(control);
    const show = attempted || group.some(other => other.classList.contains('touched'));
    const invalid = show && invalidFor(control);
    let message = messages.get(control.name);
    if (!message) {
      message = document.createElement('p');
      message.id = 'erro-'+control.name;
      message.className = 'field-error';
      message.hidden = true;
      const wrapper = control.closest('.field, .choices, .check');
      if (wrapper.matches('.field')) wrapper.append(message); else wrapper.after(message);
      messages.set(control.name, message);
    }
    message.textContent = invalid ? (control.type === 'radio' ? 'Escolha uma forma de participação.' : control.validationMessage) : '';
    message.hidden = !invalid;
    group.forEach(other => {
      other.classList.toggle('is-invalid', invalid);
      other.classList.toggle('is-valid', show && !invalid && valuePresent(control));
      if (show) other.classList.add('touched');
      if (invalid) other.setAttribute('aria-invalid','true'); else other.removeAttribute('aria-invalid');
      const description = [descriptions.get(other), invalid ? message.id : ''].filter(Boolean).join(' ');
      if (description) other.setAttribute('aria-describedby',description); else other.removeAttribute('aria-describedby');
    });
    control.closest('.choices, .check')?.classList.toggle('has-error',invalid);
  };
  const renderAll = () => {
    controls.forEach(renderControl);
    if (!attempted) return;
    const invalid = controls.filter(control => invalidFor(control));
    errorSummary.hidden = invalid.length === 0;
    errorSummary.textContent = invalid.length ? 'Revise os campos indicados antes de continuar. As mensagens junto a cada campo explicam o ajuste necessário.' : '';
  };
  const validateCPF = () => cpf.setCustomValidity(cpf.value && !validCPF(cpf.value) ? 'Informe um CPF com 11 dígitos e verificadores válidos.' : '');
  for (const [id, format] of [['cpf',formatCPF],['telefone',formatPhone],['cep',formatCEP]]) {
    const input = document.getElementById(id);
    input.addEventListener('input', () => {
      const oldValue = input.value;
      const position = input.selectionStart;
      const digitsBefore = oldValue.slice(0,position).replace(/\D/g,'').length;
      input.value = format(oldValue);
      if (position !== null) {
        let cursor = 0, seen = 0;
        while (cursor < input.value.length && seen < digitsBefore) { if (/\d/.test(input.value[cursor])) seen++; cursor++; }
        input.setSelectionRange(cursor,cursor);
      }
      if (id === 'cpf') validateCPF();
    });
  }
  controls.forEach(control => control.addEventListener('blur', () => {
    control.classList.add('touched');
    renderControl(control);
  }));
  form.addEventListener('input', () => { result.textContent = ''; if (typeof fecharToast === 'function') fecharToast(); renderAll(); });
  form.addEventListener('change', renderAll);
  form.addEventListener('invalid', () => { attempted = true; renderAll(); }, true);
  form.addEventListener('submit', event => {
    event.preventDefault();
    attempted = true;
    validateCPF();
    requiredText.forEach(validateText);
    renderAll();
    if (!form.reportValidity()) return;
    if (remember.checked) {
      const saved=storage.salvarPreferencias({perfil:form.querySelector('[name="perfil"]:checked').value,interesse:form.querySelector('#interesse').value});
      preferenceStatus.textContent=saved.ok ? 'Forma de apoio e projeto salvos neste navegador. Dados pessoais não foram armazenados.' : 'O teste passou, mas não foi possível salvar suas preferências neste navegador.';
    }
    result.textContent = 'Teste concluído: os campos passaram pela validação. Nenhum cadastro real foi realizado e nenhum dado foi enviado. Dados pessoais não foram armazenados.';
    if (typeof mostrarToast === 'function') mostrarToast('Teste concluído. Nenhum dado foi enviado.');
  });
  form.addEventListener('reset', () => {
    attempted = false;
    preferenceStatus.textContent = '';
    if (typeof fecharToast === 'function') fecharToast();
    controls.forEach(control => control.setCustomValidity(''));
    result.textContent = '';
    errorSummary.hidden = true;
    errorSummary.textContent = '';
    messages.forEach(message => { message.hidden = true; message.textContent = ''; });
    controls.forEach(control => {
      control.classList.remove('touched','is-invalid','is-valid');
      control.removeAttribute('aria-invalid');
      const original = descriptions.get(control);
      if (original) control.setAttribute('aria-describedby',original); else control.removeAttribute('aria-describedby');
    });
    form.querySelectorAll('.has-error').forEach(wrapper => wrapper.classList.remove('has-error'));
  });
  document.getElementById('enviar').disabled = false;
}

}
