export function iniciarRoteador(renderizar) {
  window.addEventListener('hashchange',()=>renderizar(location.hash,true));
  document.addEventListener('click',event=>{
    const link=event.target.closest('a');
    if (!link || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || link.target || link.hasAttribute('download')) return;
    if (link.hasAttribute('data-skip-content')) {
      event.preventDefault();
      document.getElementById('conteudo').focus();
      document.getElementById('conteudo').scrollIntoView();
      return;
    }
    const href=link.getAttribute('href');
    if (!href?.startsWith('#/')) return;
    event.preventDefault();
    if (location.hash === href) renderizar(href,true); else location.hash=href;
  });
  renderizar(location.hash,false);
}
