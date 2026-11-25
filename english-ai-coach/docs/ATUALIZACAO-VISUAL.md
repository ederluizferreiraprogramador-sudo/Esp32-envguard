# Atualização visual do FenixInglês (documento técnico + Visual Developer MCP)

Base: *Documento Técnico — Atualização do projeto HTML do FenixIngles*. Evolução incremental, sem reconstruir o app e sem copiar marca, código, textos ou ilustrações do app de referência (Mondly). Usamos só os **padrões de experiência**: escolha de nível, painel de progresso, trilha com estados claros e área de revisão.

## Comparação: tela atual × referência × mudança

| Tela atual | Padrão de referência | Diferença encontrada | Arquivo alterado | O que foi feito |
|---|---|---|---|---|
| Boas-vindas (nome, idade, meta) | Escolha de nível com cartões grandes e CTA fixo | Não perguntava o nível de inglês | `routes/bem-vindo.tsx`, `lib/student.ts` | Novo passo "Como está o seu inglês hoje?" em tela roxa, 3 cartões (`radiogroup`), estado selecionado com ✓ e botão Continuar fixo no rodapé. O nível fica salvo no perfil do aluno. |
| Trilha (home) | Painel com % concluído, categorias/lições e próxima atividade | Progresso só aparecia no Perfil | `routes/index.tsx` | Painel "Seu progresso": anel com % do curso, lições x/48, unidades x/16, itens para revisar e cartão "Próxima atividade" com botão Continuar. |
| Nós da trilha | Módulos concluídos/disponíveis/bloqueados | Estado indicado só por cor/ícone | `routes/index.tsx` | Etiquetas escritas "✓ Concluída", "▶ Disponível", "🔒 Bloqueada" e `aria-label` com o estado. |
| Barra inferior | Abas Explorar/Aprenda/Revisar/Perfil | Não havia área de revisão | `components/TopBar.tsx`, `routes/revisar.tsx`, `lib/mistakes.ts` | Nova aba **Revisar**: treino rápido (até 10 questões) com os erros pendentes, áudio e explicação; acertou → sai da lista. Atalho para o PDF de cada unidade. A aba Turma saiu da barra e continua acessível pela Casa e pelo Perfil ("Ver a turma toda"). `aria-current` na aba ativa. |
| Estilos | Design tokens, `prefers-reduced-motion` | — | `styles.fx.css` | Classes novas (`level-*`, `dash`, `node-*`, `tile-correct`) usando as variáveis de cor existentes; animações respeitam redução de movimento. |

Nada foi removido: lições, autocorreção, PDF de erros, Charlotte, Casa, Turma, avatar e heróis 3D continuam iguais.

## Testes executados

- TypeScript (`tsc --noEmit`, modo estrito): sem erros.
- Vitest (`audio.test.ts`): 12/12 passando.
- Playwright em 390×844 (celular) e 1280×800 (desktop): home com painel, trilha com etiquetas, onboarding com nível (salva `level: "basico"`), Revisar → treino → a questão acertada sai da lista; sem erros de página.
- Capturas antes/depois em `docs/atualizacao-visual/`.

## Visual Developer MCP

Pasta `visual-developer-mcp/` (cópia revisada do pacote enviado). Revisão de segurança: só acessa `VISUAL_PROJECT_ROOT`, rejeita caminhos absolutos, `..` e symlinks, grava só `.html/.css/.js` com backup automático e não executa comandos vindos da IA. Ajustes: tipos para compilar sem erro e `VISUAL_CHROMIUM_PATH` opcional. As 7 ferramentas foram testadas via stdio.

Observação: o app oficial é React (TanStack/Lovable), não HTML solto — o MCP serve bem para a versão HTML de teste e para screenshots; as mudanças no código React foram feitas diretamente em `fenixingles/src`.

## Pendências

- Aplicar estas mudanças (e as das revisões 6–11) no app do Lovable quando houver crédito.
- Pasta `references/` com as telas de referência não foi enviada ao repositório (são de app de terceiros); manter só localmente.
- Remover o nome da criança do prompt da IA e revisar direitos dos títulos do livro (ver documento de arquitetura e segurança).
