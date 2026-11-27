# AGENTS.md — regras para qualquer IA que mexa no FenixInglês

App infantil de inglês (16 unidades do livro, em ordem). Leia antes de editar.

## Estrutura
- `fenixingles/src/routes/` telas · `components/` visual · `lib/` regras · `data/` lições · `public/characters/` imagens.
- Não mude `src/data/` (conteúdo do livro) sem pedido. Textos para o aluno em português; frases de prática em inglês.

## Regras que não se quebram
1. **Crianças:** nada de anúncios, links externos soltos, coleta de nome/e-mail/idade em medição. Compras só atrás da porta do adulto.
2. **Segredos:** nunca colocar chaves no código. Use variáveis de ambiente (`VITE_*` só para chaves públicas).
3. **Medição:** só via `lib/analytics.ts` (`track`), com consentimento do responsável e sem dados pessoais.
4. **Estilo:** paleta e classes em `styles.fx.css`; animações respeitam "reduzir movimento"; toda ação com `aria-label`/texto.
5. **Progresso:** salvo por conta (`lib/accounts.ts`); nunca misturar dados de duas pessoas.
6. **Direitos:** não copiar arte, marca ou texto de terceiros (Duolingo, Mondly, Marvel etc.). Imagens são originais.

## Antes de entregar
`tsc --noEmit` sem erros, testes (`vitest`) passando, testar no celular (390×844) e no desktop. Mudanças pequenas e commit com mensagem clara.
