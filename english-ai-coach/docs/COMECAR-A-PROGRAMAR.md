# Começar a programar — os 3 modelos do FenixInglês

| | 1. FenixInglês (código-fonte completo) | 2. Base44 | 3. Lovable |
|---|---|---|---|
| App | https://claude.ai/artifact/JeQ5brUjYbPYf7mXvXLpf4 (teste) | https://fenix-ingles-c5968695.base44.app | https://fenixingles.lovable.app |
| Versão | **A mais completa** (rev19) | Antiga + login por e-mail | Trilha das ilhas (sem as novidades rev6–19 ainda) |
| Stack | React + TypeScript + Tailwind v4 + TanStack | React (JSX) + TanStack Start + entidades Base44 | React + TypeScript + TanStack Start + shadcn |
| Login | Supabase (`src/lib/accounts.ts`); no link de teste, conta Claude | e-mail/senha nativo | pendente (pacote pronto) |
| Código | `fenixingles/` neste repositório | exportar (abaixo) | sincronizar com GitHub (abaixo) |

Telas: pasta `docs/telas/` (trilha, ilhas, revisar, conversa, casa, perfil, avatar de herói, Fênix Imortal).

## 1) FenixInglês — pasta `fenixingles/`
- `src/routes/` telas · `src/components/` personagens, trilha, avatar · `src/lib/` regras (progresso, erros, PDF, recompensas, login) · `src/data/` 16 unidades (384 atividades) · `public/characters/` imagens.
- Contas: `src/lib/accounts.ts` (nuvem/Supabase). Versão do link de teste: `teste-claude/`.
- Rodar num projeto TanStack Start/Vite com Tailwind v4: copie `src/` e `public/`, use `src/styles.fx.css` como CSS base, instale `@tanstack/react-router`, `sonner`, `jspdf`, `@supabase/supabase-js`. Testes: `src/*.test.ts` (vitest). Segurança e arquitetura: `docs/`.
- Outros materiais: `mcp-server/` (conteúdo do livro), `visual-developer-mcp/`, `docs/`.

## 2) Base44
Código (~150 arquivos, `src/routes/_authed/*`, `src/data/units*.js`, `base44/entities/*.jsonc`) fica no Base44.
- No editor: app → **Code / Export** (baixar .zip), ou conecte o **GitHub** (Settings → GitHub) para ter o repositório e programar localmente com a CLI `base44`.
- Entidades: `UserProgress`, `Mistake` (RLS por dono).

## 3) Lovable
- No editor: **GitHub → Connect project** (cria o repositório com sincronização de duas vias), ou **Code → Download**.
- Para trazer as novidades: `tools/pacote-lovable.sh` e `docs/LOVABLE-LOGIN.md` (precisa de créditos).
