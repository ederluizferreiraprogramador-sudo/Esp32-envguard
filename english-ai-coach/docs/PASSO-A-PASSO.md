# Passo a passo de configuração inicial

> Ordem recomendada. Cada etapa tem um critério de "pronto" para você validar antes de seguir.

## Etapa 0 — Ferramentas no seu computador
Instale e confira as versões:
```bash
git --version
node --version      # Node 20 ou superior (exigido pelo Paperclip)
python --version    # 3.11+
docker --version    # opcional agora; usado depois com PostgreSQL
```
**Pronto quando:** os quatro comandos respondem.

## Etapa 1 — Repositório e livros
1. Clone o repositório e entre na pasta `english-ai-coach/`.
2. Coloque os PDFs do livro em `english-ai-coach/books/` — a pasta e todo `*.pdf` estão no `.gitignore`, então **não vão para o GitHub**.
3. Nunca coloque chaves de API no código; use arquivo `.env` (também ignorado).

## Etapa 2 — Validar a ideia no Lovable (versão web)
Decisão da conversa: validar primeiro, depois ir para nativo.
1. Crie um projeto no Lovable e cole o prompt de `docs/PROMPT-LOVABLE.md`.
2. Use `content/curriculum.json` como conteúdo das lições.
3. Teste no celular e no Windows por alguns dias.
**Pronto quando:** você consegue concluir 3 unidades e sabe dizer o que mudaria.

## Etapa 3 — Servidor MCP (já incluído)
```bash
cd english-ai-coach/mcp-server
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python -m pytest -q                # deve passar (3 testes)
```
Conectar ao Claude Code:
```bash
claude mcp add english-ai-coach -- /caminho/para/.venv/bin/python /caminho/para/english-ai-coach/mcp-server/server.py
```
(No Windows use o `python.exe` dentro de `.venv\Scripts\`.) Depois, no Claude Code, peça: "liste as unidades do english-ai-coach".
Ferramentas: `list_units`, `get_unit`, `get_vocabulary`, `make_quiz`, `check_answer`, `record_attempt`, `get_progress`.
**Pronto quando:** o Claude consegue listar as 16 unidades e corrigir uma resposta.

## Etapa 4 — Paperclip (orquestração de agentes)
Paperclip é uma ferramenta open source, local, que organiza agentes de IA (Claude Code, Codex etc.) como uma "equipe" com tarefas, orçamento por agente e histórico. Repositório oficial: <https://github.com/paperclipai/paperclip>.
```bash
npx paperclipai onboard --yes      # instala e sobe em http://localhost:3100
```
Sugestão de uso no projeto:
1. Crie uma "empresa" chamada **English AI Coach**.
2. Agentes (adaptador Claude Code), cada um com orçamento baixo no começo:
   - **Conteúdo** — expande `content/curriculum.json` seguindo `docs/CURRICULO.md`.
   - **Dev** — implementa as telas/sprints.
   - **Revisor** — confere diffs, testes e direitos autorais.
3. Dê ao agente de Conteúdo acesso ao servidor MCP da Etapa 3.
4. Tarefa inicial: "Expandir U01–U04 para 20 palavras e 10 questões cada".
> Confirme os comandos na documentação oficial: a ferramenta é nova e muda rápido. Se `npx` falhar com E404, force o registro público do npm.
**Pronto quando:** o painel abre e um agente conclui uma tarefa pequena.

## Etapa 5 — App nativo (depois da validação)
- **Android:** Kotlin + Jetpack Compose, com o plugin do Claude Code no Android Studio.
- **iPhone:** Kotlin puro só gera Android; para iOS use Kotlin Multiplatform (fica para depois).
- Reaproveite `curriculum.json` como fonte única de conteúdo.

## Etapa 6 — Backend e IA (conforme a especificação MVP)
FastAPI + PostgreSQL + tutor IA via backend (chave só no servidor). Veja o documento de especificação (Sprints 2–5). Observação: a especificação v1.0 deixava o MCP fora do MVP; agora ele entra como camada de conteúdo/progresso (Etapa 3).
