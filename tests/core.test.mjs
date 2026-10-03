import test from 'node:test';
import assert from 'node:assert/strict';
const rotas = await import('../js/modules/rotas.mjs').catch(() => ({}));
const persistencia = await import('../js/modules/armazenamento.mjs').catch(() => ({}));
const dados = await import('../js/modules/projetos-dados.mjs').catch(() => ({}));

test('rotas conhecidas e links profundos preservam o destino', () => {
  assert.deepEqual(rotas.resolverRota('#/projetos/cuidar'), {pagina:'projetos',ancora:'cuidar'});
  assert.deepEqual(rotas.resolverRota(''), {pagina:'inicio',ancora:''});
  assert.deepEqual(rotas.resolverRota('#/cadastro'), {pagina:'cadastro',ancora:''});
});
test('rotas desconhecidas ou com segmento extra não simulam uma tela válida', () => {
  assert.equal(rotas.resolverRota('#/qualquer').pagina,'nao-encontrada');
  assert.equal(rotas.resolverRota('#/cadastro/qualquer').pagina,'nao-encontrada');
  assert.equal(rotas.resolverRota('#/projetos/cuidar/extra').pagina,'nao-encontrada');
});
test('busca ignora acentos e combina categoria com favoritos', () => {
  const projects = [{id:'encontro',categoria:'adocao',titulo:'Encontro de Patas',descricao:'Adoção responsável'}, {id:'cuidar',categoria:'cuidado',titulo:'Cuidar',descricao:'Saúde animal'}];
  assert.deepEqual(dados.filtrarProjetos(projects,{busca:'adocao'}).map(p=>p.id),['encontro']);
  assert.deepEqual(dados.filtrarProjetos(projects,{categoria:'cuidado',somenteFavoritos:true,favoritos:['encontro']}),[]);
});
function memoryStorage(initial={}) {
  const values=new Map(Object.entries(initial));
  return {getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,String(value)),removeItem:key=>values.delete(key)};
}
test('favoritos persistem apenas identificadores conhecidos e sem repetição', () => {
  const storage=memoryStorage();
  const first=persistencia.criarArmazenamento(storage);
  assert.equal(first.salvarFavoritos(['cuidar','cuidar','<script>','encontro']).ok,true);
  assert.deepEqual(persistencia.criarArmazenamento(storage).lerFavoritos().valor,['cuidar','encontro']);
});
test('JSON corrompido produz lista vazia e informa o problema', () => {
  const storage=memoryStorage({'abrigo:favoritos:v1':'{ruim'});
  assert.deepEqual(persistencia.criarArmazenamento(storage).lerFavoritos(),{ok:false,valor:[]});
});
test('armazenamento bloqueado é tratado sem derrubar a aplicação', () => {
  const blocked={getItem(){throw new Error('bloqueado');},setItem(){throw new Error('quota');},removeItem(){throw new Error('bloqueado');}};
  const service=persistencia.criarArmazenamento(blocked);
  assert.deepEqual(service.lerFavoritos(),{ok:false,valor:[]});
  assert.equal(service.salvarFavoritos(['cuidar']).ok,false);
});
test('preferências persistidas excluem identidade e contato', () => {
  const storage=memoryStorage();
  const service=persistencia.criarArmazenamento(storage);
  service.salvarPreferencias({perfil:'voluntario',interesse:'acolhimento',cpf:'52998224725',nome:'Pessoa de teste',email:'teste@exemplo.invalid'});
  assert.deepEqual(service.lerPreferencias().valor,{perfil:'voluntario',interesse:'acolhimento'});
  service.limparPreferencias();
  assert.equal(service.lerPreferencias().valor,null);
});
