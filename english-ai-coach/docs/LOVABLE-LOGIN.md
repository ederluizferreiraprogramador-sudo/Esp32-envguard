# Atualização do app oficial (Lovable): todas as novidades + login por e-mail

O arquivo `fenixingles-pacote.zip` anexado tem a pasta `pacote/` com o código atual do app
(`src/components`, `src/lib`, `src/routes`, `src/styles.fx.css`, testes) e as imagens
(`public/characters`). Ele NÃO tem `src/data` (as unidades já estão no projeto) nem
`__root.tsx`, `router`, `routeTree`, `components/ui` ou `integrations` (mantenha os do projeto).

## Passos

1. **Lovable Cloud**: ative o banco/autenticação do projeto (se ainda não estiver ativo).
2. **Arquivos**: descompacte o anexo e copie por cima do projeto:
   - `pacote/src/components/*` → `src/components/` (sem apagar `src/components/ui`)
   - `pacote/src/lib/*` → `src/lib/`
   - `pacote/src/routes/*` → `src/routes/` (sem apagar `__root.tsx`)
   - `pacote/src/*.test.ts` → onde ficam os testes do projeto (ajuste imports se preciso)
   - `pacote/public/characters/*` → `public/characters/`
   - Substitua o conteúdo de `src/styles.css` pelo de `pacote/src/styles.fx.css`, mantendo
     só o que o build do projeto exigir (fontes, plugins já instalados).
3. **Banco** (migração):
   ```sql
   create table public.progresso_alunos (
     user_id uuid primary key references auth.users(id) on delete cascade,
     dados jsonb not null default '{}'::jsonb,
     atualizado_em timestamptz not null default now()
   );
   alter table public.progresso_alunos enable row level security;
   create policy "ler o próprio progresso" on public.progresso_alunos for select to authenticated using (auth.uid() = user_id);
   create policy "criar o próprio progresso" on public.progresso_alunos for insert to authenticated with check (auth.uid() = user_id);
   create policy "atualizar o próprio progresso" on public.progresso_alunos for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
   create policy "apagar o próprio progresso" on public.progresso_alunos for delete to authenticated using (auth.uid() = user_id);
   ```
4. **Autenticação**: e-mail + senha, com confirmação de e-mail ligada. Em URLs de
   redirecionamento permita `https://fenixingles.lovable.app/**` e a URL de preview.
   O `src/lib/accounts.ts` importa `supabase` de `@/integrations/supabase/client`
   (ajuste o caminho se o projeto usar outro).
5. **Proteção das telas**: no `__root.tsx`, use `useAuth()` de `@/lib/accounts`: enquanto
   `ready` for falso mostre a tela em branco/carregando; se não estiver logado e a rota não
   for `/entrar`, `/cadastro`, `/esqueci-senha` ou `/redefinir-senha`, redirecione para `/entrar`.
6. **Rotas novas**: `/entrar`, `/cadastro`, `/esqueci-senha`, `/redefinir-senha`, `/revisar`,
   `/imortal` (gere o routeTree).
7. Rode o build/typecheck e os testes; corrija só o necessário para compilar. Não mude
   textos, cores nem regras do app.

## Como o login funciona

- Cada conta (e-mail do responsável) tem o seu progresso na tabela `progresso_alunos`
  (um JSON com progresso, erros, revisão, ninho, Fênix Imortal, casa e avatar).
- Ao entrar, o app apaga os dados locais e baixa os da conta: o progresso de uma
  pessoa nunca aparece na conta de outra. As mudanças sobem a cada 5 s e ao sair da página.
- "Esqueci minha senha" envia um link; ele abre `/redefinir-senha` para criar a nova senha.
- Senha: 8+ caracteres com letras e números. O cadastro pede a confirmação de um adulto.
