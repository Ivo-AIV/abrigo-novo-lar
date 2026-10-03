# Abrigo Novo Lar

Projeto acadêmico das Experiências Práticas I a IV de Desenvolvimento Front-end. A ONG, os projetos e os contatos são fictícios. As fotografias foram geradas por IA. Não há cadastro, adoção ou pagamento real.

[Demonstração](https://ivo-aiv.github.io/abrigo-novo-lar/) · [Repositório](https://github.com/Ivo-AIV/abrigo-novo-lar)

## Instalação e execução

Requisitos: Node 22 ou superior, npm e servidor HTTP estático. Python 3 é uma opção para servir os arquivos.

```sh
git clone https://github.com/Ivo-AIV/abrigo-novo-lar.git
cd abrigo-novo-lar
npm ci
npm run build
npm test
python -m http.server 8765 --bind 127.0.0.1
```

Abra `http://127.0.0.1:8765/dist/index.html` para testar a produção ou `http://127.0.0.1:8765/html/index.html` para testar o código de origem. Módulos exigem HTTP; duplo clique no arquivo não executa a SPA corretamente. O teste de produção exige rodar o build primeiro.

## Funcionalidades e estrutura

As rotas `#/inicio`, `#/projetos` e `#/cadastro` compartilham uma página. Links profundos, voltar e avançar funcionam por hash. Projetos oferecem busca, filtro por área e favoritos com Vue. O cadastro demonstra máscaras, validação e feedback, usando apenas dados fictícios.

| Pasta | Responsabilidade |
| --- | --- |
| html | Documento principal e conteúdo inicial |
| css | Sistema visual e regras responsivas |
| imagens | Fotografias de origem e marca |
| js/modules | Rotas, templates, navegação, acessibilidade, formulário, projetos e armazenamento |
| js/vendor | Vue ESM local, origem e licença MIT |
| scripts | Build com esbuild e otimização com sharp |
| tests | Rotas, armazenamento, máscaras e integridade do build |
| evidencias | Registros da verificação técnica |
| dist | Saída gerada para publicação, sem node_modules ou arquivos de trabalho |

## Dados e acessibilidade

`abrigo:favoritos:v1` guarda IDs de projetos. `abrigo:preferencias:v1` guarda somente perfil de apoio e projeto de interesse, mediante escolha explícita após teste válido. Nome, CPF, e-mail, telefone e endereço não são persistidos. O rascunho fica apenas em memória até recarregar. Esquecer preferências remove a chave. JSON inválido e armazenamento bloqueado recebem tratamento.

O site inclui HTML semântico, idioma pt-BR, títulos, textos alternativos, labels, fieldsets, mensagens de erro associadas, link para pular ao conteúdo, foco visível, navegação por teclado, diálogo nativo, regiões de status, movimento reduzido e alto contraste. O tema de contraste vale durante a sessão e não grava dados.

A verificação usa os critérios aplicáveis da WCAG 2.1 A e AA, com inspeção do DOM e da árvore de acessibilidade, medição de contraste e testes no Chrome. A cobertura e as limitações estão em [ACESSIBILIDADE.md](ACESSIBILIDADE.md). Não se declara certificação integral nem teste real com NVDA ou VoiceOver.

## Build e deploy

O build minifica HTML, CSS e JavaScript, agrupa módulos com esbuild, preserva importação tardia dos projetos e gera nomes com hash. As fotografias recebem WebP de 480 e 1120 pixels com JPEG de fallback. A produção exclui PNGs grandes, evidências e testes. Caminhos relativos permitem publicação sob o prefixo do repositório.

GitHub Actions instala com `npm ci`, executa build e testes e publica somente `dist/` no Pages após integração na main. Em pull requests, executa a validação sem publicar. Não há segredos de aplicação, dependência de serviços pagos ou coleta de dados.

## Versionamento e manutenção

GitFlow simplificado: main para versão publicada, develop para integração, feature/ para mudanças, release/ para revisão final e hotfix/ para correções urgentes futuras. Conventional Commits distinguem feat, fix, docs e chore. `v1.0.0` marca a primeira release deste histórico, iniciado com a base concluída da experiência III. Não foram recriados commits retroativos.

Ver [CONTRIBUTING.md](CONTRIBUTING.md) e [CHANGELOG.md](CHANGELOG.md). Projeto individual com assistência de IA; pull requests registram mudanças e verificações sem simular colaboração entre pessoas.

## Referências e licença

[WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/) · [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) · [esbuild](https://esbuild.github.io/api/) · [Vue](https://vuejs.org/guide/quick-start.html)

A licença MIT do Vue acompanha o projeto em js/vendor. As demais dependências conservam suas licenças no registro npm. Material destinado ao estudo; uso de dependências não transfere sua autoria.
