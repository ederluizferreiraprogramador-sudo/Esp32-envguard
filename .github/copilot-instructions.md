# Instruções para o GitHub Copilot — FenixInglês

App infantil de inglês (Brasil), 16 unidades na ordem do livro. Código em `english-ai-coach/fenixingles/`.
**Leia `english-ai-coach/fenixingles/AGENTS.md` e siga as regras dele.**

- Idioma: textos para o aluno em português; frases de prática em inglês. Commits e PRs em português.
- Crianças: sem anúncios, sem coleta de dados pessoais, medição só por `src/lib/analytics.ts` (com consentimento).
- Nunca coloque chaves ou senhas no código. Nunca copie arte, marca ou texto de terceiros.
- Não altere `src/data/` (conteúdo do livro) sem pedido explícito.
- Antes de abrir o PR: `cd english-ai-coach/fenixingles && npm ci && npm run check` deve passar.
- PRs pequenos, com uma mudança por vez, e descrição do que foi testado.
