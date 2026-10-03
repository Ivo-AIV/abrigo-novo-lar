import {resolverRota} from './modules/rotas.mjs';
import {templates} from './modules/templates.mjs';
import {iniciarRoteador} from './modules/roteador.mjs';
import {iniciarNavegacao} from './modules/navegacao.mjs';
import {iniciarFeedback} from './modules/feedback.mjs';
import {iniciarFormulario} from './modules/formulario.mjs';
import {criarArmazenamento} from './modules/armazenamento.mjs';
import {iniciarAcessibilidade} from './modules/acessibilidade.mjs';

let local;
try { local=window.localStorage; } catch { local=undefined; }
const storage=criarArmazenamento(local);
const feedback=iniciarFeedback();
iniciarNavegacao();
iniciarAcessibilidade();
const main=document.getElementById('conteudo');
const titles={inicio:'Um novo começo para cada animal',projetos:'Projetos que acolhem e transformam',cadastro:'Faça parte da rede de cuidado','nao-encontrada':'Página não encontrada'};
let dispose=()=>{};
let generation=0;
let draft=null;
const saveDraft=()=>{
  const form=main.querySelector('form');
  if (!form) return;
  draft=Array.from(form.elements).filter(el=>el.name).map(el=>({name:el.name,value:el.value,checked:el.checked,type:el.type}));
};
const restoreDraft=form=>{
  if (!draft) return;
  draft.forEach(item=>{
    const el=Array.from(form.elements).find(el=>el.name===item.name && (item.type !== 'radio' || el.value===item.value));
    if (!el) return;
    if (item.type==='radio' || item.type==='checkbox') el.checked=item.checked; else el.value=item.value;
  });
};
function focusContent(ancora,moveFocus) {
  if (!moveFocus && !ancora) return;
  const target=ancora ? document.getElementById(ancora) : main;
  if (target && target!==main) target.tabIndex=-1;
  (target || main).focus({preventScroll:true});
  (target || main).scrollIntoView({block:'start'});
}
async function renderizar(hash,moveFocus) {
  const current=++generation;
  saveDraft();
  dispose();
  dispose=()=>{};
  feedback.fecharToast();
  const route=resolverRota(hash);
  // Somente templates internos entram neste ponto. Dados digitados usam value/textContent.
  main.innerHTML=templates[route.pagina];
  document.title=titles[route.pagina]+' | Abrigo Novo Lar';
  document.querySelectorAll('.site-header [aria-current]').forEach(el=>el.removeAttribute('aria-current'));
  const active=document.querySelector('.site-header a[href="#/'+route.pagina+'"]');
  active?.setAttribute('aria-current','page');
  if (route.pagina==='projetos') document.querySelector('.nav-dropdown summary').setAttribute('aria-current','page');
  document.getElementById('rota-status').textContent=moveFocus ? 'Tela aberta: '+titles[route.pagina]+'.' : '';
  if (route.pagina==='cadastro') {
    const form=main.querySelector('form');
    iniciarFormulario(form,{storage,...feedback});
    restoreDraft(form);
    form.addEventListener('reset',()=>{draft=null;});
  }
  focusContent(route.ancora,moveFocus);
  if (route.pagina==='projetos') {
    try {
      const {inicializarProjetos}=await import('./modules/projetos.mjs');
      if (current!==generation) return;
      dispose=inicializarProjetos(main.querySelector('.project-list'),storage);
      focusContent(route.ancora,moveFocus);
    } catch {
      if (current!==generation) return;
      const notice=document.createElement('p');
      notice.className='note';
      notice.setAttribute('role','status');
      notice.textContent='Os filtros estão indisponíveis agora. Você ainda pode conhecer todos os projetos abaixo.';
      main.querySelector('.project-list').prepend(notice);
    }
  }
}
iniciarRoteador(renderizar);
