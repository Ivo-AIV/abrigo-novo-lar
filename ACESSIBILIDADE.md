# Verificação de acessibilidade

Escopo: três telas da SPA em Chrome, com teclado, DOM e árvore de acessibilidade. Referência: WCAG 2.1, níveis A e AA. Esta é uma verificação técnica de critérios aplicáveis, sem certificação de conformidade integral.

| Critério | Implementação e verificação |
| --- | --- |
| 1.1.1 | Fotografias com alt descritivo; marca decorativa com alt vazio dentro de link nomeado |
| 1.3.1 e 1.3.2 | Regiões, cabeçalhos, labels, fieldsets e ordem coerente no DOM |
| 1.3.5 | Autocomplete nos campos com finalidade pessoal aplicável |
| 1.4.1 | Erros e estados têm texto e atributos, além de cor |
| 1.4.3 | Textos medidos nos dois temas; menor relação normal 5,32:1, acima de 4,5:1 |
| 1.4.10 | Layout fluido sem rolagem horizontal em largura estreita |
| 1.4.11 | Bordas de campos e foco com cores contrastantes; modo de alto contraste e cores forçadas |
| 2.1.1 e 2.1.2 | Controles nativos, Tab, Enter, Space e Escape; diálogo sem aprisionamento permanente |
| 2.4.1 a 2.4.4 | Skip link, título por rota, foco no conteúdo e links com propósito |
| 2.4.6 e 2.4.7 | Títulos, labels e foco visível |
| 3.1.1 | Idioma pt-BR |
| 3.2.1 e 3.2.2 | Digitação não troca a tela; submissão e navegação exigem ação explícita |
| 3.3.1 e 3.3.2 | Erros identificados por texto, resumo e associação ao campo |
| 4.1.2 e 4.1.3 | Nomes acessíveis, aria-pressed, aria-expanded, aria-invalid e regiões status/alert |

Medição de texto: cores computadas do elemento e do ancestral com fundo opaco; limiar de 4,5:1 para texto comum e 3:1 para texto grande. As fotografias não carregam texto sobreposto. O relatório JSON conserva as medições, e não deve ser tratado como auditoria de todos os estados possíveis.

Limitações: não foi realizado teste com um leitor de tela real nem uma auditoria de todos os critérios WCAG, navegadores e tecnologias assistivas. Não há conteúdo audiovisual, login ou operações financeiras. Revisões futuras devem incluir usuários de tecnologias assistivas, zoom, espaçamento de texto e diferentes sistemas operacionais.
