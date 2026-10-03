export function iniciarAcessibilidade() {
  const button=document.getElementById('contraste');
  button.hidden=false;
  button.addEventListener('click',()=>{
    const active=document.documentElement.classList.toggle('alto-contraste');
    button.setAttribute('aria-pressed',String(active));
  });
}
