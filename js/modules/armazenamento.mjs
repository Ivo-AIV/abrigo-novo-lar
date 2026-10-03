const ids = new Set(['portas-abertas','cuidar','encontro']);
const perfis = new Set(['voluntario','doador','ambos']);
const interesses = new Set(['acolhimento','cuidado','adocao']);
const limparFavoritos = valor => Array.isArray(valor) ? [...new Set(valor.filter(id=>ids.has(id)))] : [];
const limparPreferencias = valor => valor && perfis.has(valor.perfil) && interesses.has(valor.interesse) ? {perfil:valor.perfil,interesse:valor.interesse} : null;
export function criarArmazenamento(storage) {
  const ler = (chave,limpar,padrao) => {
    try { const texto=storage.getItem(chave); return {ok:true,valor:texto === null ? padrao : limpar(JSON.parse(texto))}; }
    catch { return {ok:false,valor:padrao}; }
  };
  const salvar = (chave,valor) => {
    try { storage.setItem(chave,JSON.stringify(valor)); return {ok:true}; }
    catch { return {ok:false}; }
  };
  return {
    lerFavoritos:()=>ler('abrigo:favoritos:v1',limparFavoritos,[]),
    salvarFavoritos:valor=>salvar('abrigo:favoritos:v1',limparFavoritos(valor)),
    lerPreferencias:()=>ler('abrigo:preferencias:v1',limparPreferencias,null),
    salvarPreferencias:valor=>salvar('abrigo:preferencias:v1',limparPreferencias(valor)),
    limparPreferencias() { try { storage.removeItem('abrigo:preferencias:v1'); return {ok:true}; } catch { return {ok:false}; } }
  };
}
