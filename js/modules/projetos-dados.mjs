const normalizar = texto => String(texto ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
export function filtrarProjetos(projetos,{categoria='',busca='',favoritos=[],somenteFavoritos=false}={}) {
  const termo=normalizar(busca);
  return projetos.filter(projeto=>(!categoria || projeto.categoria===categoria) && (!somenteFavoritos || favoritos.includes(projeto.id)) && normalizar(projeto.titulo+' '+projeto.descricao+' '+projeto.etiqueta).includes(termo));
}

export const projetos = [
  {
    "id": "portas-abertas",
    "categoria": "acolhimento",
    "titulo": "Portas Abertas",
    "etiqueta": "Acolhimento",
    "descricao": "Proposta de acolhimento temporário para cães e gatos desabrigados, com alimentação, ambiente seguro e avaliação inicial.",
    "html": "<picture><source srcset=\"../imagens/acolhimento.webp\" type=\"image/webp\"><source srcset=\"../imagens/acolhimento.png\" type=\"image/png\"><img src=\"../imagens/acolhimento.jpg\" width=\"1120\" height=\"896\" alt=\"Imagem gerada por IA de cachorro e gato descansando em um ambiente acolhedor.\" loading=\"lazy\"></picture><div><p class=\"eyebrow\">01 / Proteção</p><span class=\"badge\">Acolhimento</span><h3>Portas Abertas</h3><p>Proposta de acolhimento temporário para cães e gatos desabrigados, com alimentação, ambiente seguro e avaliação inicial.</p><dl><dt>Público atendido</dt><dd>Animais em situação de abandono ou vulnerabilidade.</dd><dt>Objetivo</dt><dd>Oferecer proteção até que cada animal possa iniciar sua recuperação e encontrar um lar.</dd><dt>Como participar</dt><dd>Apoiar a rotina do abrigo ou contribuir com alimentos e materiais de higiene.</dd></dl><a class=\"text-link\" href=\"#/cadastro\">Apoiar o acolhimento →</a></div>"
  },
  {
    "id": "cuidar",
    "categoria": "cuidado",
    "titulo": "Cuidar para Recomeçar",
    "etiqueta": "Saúde animal",
    "descricao": "Iniciativa fictícia de acompanhamento veterinário, vacinação e castração, planejada com profissionais habilitados.",
    "html": "<picture><source srcset=\"../imagens/cuidado.webp\" type=\"image/webp\"><source srcset=\"../imagens/cuidado.png\" type=\"image/png\"><img src=\"../imagens/cuidado.jpg\" width=\"1120\" height=\"896\" alt=\"Imagem gerada por IA de uma veterinária examinando gentilmente um gato tigrado.\" loading=\"lazy\"></picture><div><p class=\"eyebrow\">02 / Bem-estar</p><span class=\"badge badge--care\">Saúde animal</span><h3>Cuidar para Recomeçar</h3><p>Iniciativa fictícia de acompanhamento veterinário, vacinação e castração, planejada com profissionais habilitados.</p><dl><dt>Público atendido</dt><dd>Cães e gatos acolhidos que precisam de cuidados de saúde.</dd><dt>Objetivo</dt><dd>Promover recuperação e bem-estar, preparando os animais para a adoção.</dd><dt>Como participar</dt><dd>Colaborar com transporte, organização dos atendimentos e apoio material.</dd></dl><a class=\"text-link\" href=\"#/cadastro\">Participar da rede de cuidado →</a></div>"
  },
  {
    "id": "encontro",
    "categoria": "adocao",
    "titulo": "Encontro de Patas",
    "etiqueta": "Adoção responsável",
    "descricao": "Proposta de divulgação de animais disponíveis e encontros de adoção responsável, com orientação aos interessados.",
    "html": "<picture><source srcset=\"../imagens/adocao.webp\" type=\"image/webp\"><source srcset=\"../imagens/adocao.png\" type=\"image/png\"><img src=\"../imagens/adocao.jpg\" width=\"1120\" height=\"896\" alt=\"Imagem gerada por IA de uma voluntária abraçando um cachorro caramelo em um pátio arborizado.\" loading=\"lazy\"></picture><div><p class=\"eyebrow\">03 / Vínculos</p><span class=\"badge badge--adoption\">Adoção responsável</span><h3>Encontro de Patas</h3><p>Proposta de divulgação de animais disponíveis e encontros de adoção responsável, com orientação aos interessados.</p><dl><dt>Público atendido</dt><dd>Animais aptos à adoção e famílias interessadas em acolhê-los.</dd><dt>Objetivo</dt><dd>Construir vínculos duradouros, considerando as necessidades do animal e a rotina da família.</dd><dt>Como participar</dt><dd>Ajudar na divulgação, na organização dos encontros ou manifestar interesse em apoiar a iniciativa.</dd></dl><a class=\"text-link\" href=\"#/cadastro\">Ajudar a encontrar novos lares →</a></div>"
  }
];
