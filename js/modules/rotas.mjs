const paginas = new Set(['inicio','projetos','cadastro']);
const iniciativas = new Set(['portas-abertas','cuidar','encontro']);
export function resolverRota(hash = '') {
  if (!hash || hash === '#/' || hash === '#') return {pagina:'inicio',ancora:''};
  const partes = String(hash).replace(/^#\//,'').split('/');
  const [pagina, ancora = ''] = partes;
  if (!String(hash).startsWith('#/') || !paginas.has(pagina) || partes.length > 2 || (ancora && (pagina !== 'projetos' || !iniciativas.has(ancora)))) return {pagina:'nao-encontrada',ancora:''};
  return {pagina,ancora};
}
