import {createApp,ref,computed,h,nextTick} from '../vendor/vue.esm-browser.prod.mjs';
import {projetos,filtrarProjetos} from './projetos-dados.mjs';

export function inicializarProjetos(container,storage) {
  const app=createApp({
    setup() {
      const loaded=storage.lerFavoritos();
      const favorites=ref(loaded.valor);
      const category=ref('');
      const search=ref('');
      const onlyFavorites=ref(false);
      const message=ref(loaded.ok ? '' : 'Não foi possível recuperar os favoritos. Você pode continuar usando os projetos.');
      const filtered=computed(()=>filtrarProjetos(projetos,{categoria:category.value,busca:search.value,favoritos:favorites.value,somenteFavoritos:onlyFavorites.value}));
      function toggle(project) {
        const selected=favorites.value.includes(project.id);
        favorites.value=selected ? favorites.value.filter(id=>id!==project.id) : [...favorites.value,project.id];
        const saved=storage.salvarFavoritos(favorites.value);
        message.value=saved.ok ? project.titulo+(selected ? ' removido dos favoritos.' : ' salvo nos favoritos deste navegador.') : 'A seleção foi atualizada nesta sessão, mas não foi possível salvar neste navegador.';
        if (selected && onlyFavorites.value) nextTick(()=>container.querySelector('#busca-projetos').focus());
      }
      const toolbar=()=>h('div',{class:'project-toolbar'},[
        h('div',{class:'field'},[h('label',{for:'busca-projetos'},'Buscar um projeto'),h('input',{id:'busca-projetos',type:'search',maxlength:80,placeholder:'Nome ou tema do projeto',value:search.value,onInput:e=>search.value=e.target.value})]),
        h('div',{class:'field'},[h('label',{for:'categoria-projetos'},'Área de atuação'),h('select',{id:'categoria-projetos',onChange:e=>category.value=e.target.value},[['','Todas as áreas'],['acolhimento','Acolhimento'],['cuidado','Saúde animal'],['adocao','Adoção responsável']].map(([value,label])=>h('option',{value,selected:value===category.value},label)))]),
        h('label',{class:'check favorite-filter'},[h('input',{type:'checkbox',checked:onlyFavorites.value,onChange:e=>onlyFavorites.value=e.target.checked}),'Mostrar somente favoritos']),
        h('p',{class:'small'},'Favoritos ficam salvos apenas neste navegador. Você pode removê-los a qualquer momento.')
      ]);
      const card=(project,index)=>{
        const split=project.html.indexOf('</picture>')+'</picture>'.length;
        const selected=favorites.value.includes(project.id);
        return h('article',{class:'project'+(index%2 ? ' reverse' : ''),id:project.id,key:project.id},[
          h('div',{class:'project-image',innerHTML:project.html.slice(0,split)}),
          h('div',{class:'project-copy'},[
            h('div',{innerHTML:project.html.slice(split)}),
            h('button',{type:'button',class:'favorite-button','aria-pressed':String(selected),'aria-label':(selected?'Remover ':'Salvar ')+project.titulo+(selected?' dos favoritos':' nos favoritos'),onClick:()=>toggle(project)},selected ? '♥ Salvo nos favoritos' : '♡ Salvar projeto')
          ])
        ]);
      };
      return ()=>[
        h('h2',{id:'iniciativas',class:'sr-only'},'Nossas iniciativas sociais'),
        toolbar(),
        h('p',{class:'project-count',role:'status','aria-live':'polite'},filtered.value.length+' de '+projetos.length+' projetos encontrados. '+favorites.value.length+(favorites.value.length===1 ? ' favorito.' : ' favoritos.')),
        h('p',{class:'small storage-message',role:'status','aria-live':'polite'},message.value),
        filtered.value.length ? filtered.value.map(card) : h('div',{class:'empty-state'},[h('h3',{},'Nenhum projeto por aqui.'),h('p',{},'Experimente outro termo, escolha todas as áreas ou desative o filtro de favoritos.'),h('button',{class:'text-link',type:'button',onClick:()=>{category.value='';search.value='';onlyFavorites.value=false;nextTick(()=>container.querySelector('#busca-projetos').focus());}},'Limpar filtros')])
      ];
    }
  });
  app.mount(container);
  return ()=>app.unmount();
}
