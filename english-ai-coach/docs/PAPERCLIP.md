# Paperclip — equipe de agentes do FenixInglês

Paperclip (https://github.com/paperclipai/paperclip, MIT) coordena agentes de IA como uma empresa:
você é o dono; o CEO divide a meta; o CTO cria tarefas para os engenheiros. Roda no seu computador.
(Informações de terceiros: confira o README oficial antes de instalar.)

## Instalar no Mac (e no Windows igual, pelo terminal)
1. Instale o Node.js LTS (nodejs.org) e o Git (git-scm.com).
2. Baixe o projeto:
   ```
   git clone https://github.com/ederluizferreiraprogramador-sudo/Esp32-envguard.git
   cd Esp32-envguard && git checkout claude/novo-projeto-app-ingles-b748xs
   ```
3. Instale o Paperclip (numa pasta separada, fora do repositório):
   ```
   mkdir ~/paperclip && cd ~/paperclip
   npx paperclipai onboard --yes
   ```
4. Abra o endereço que o terminal mostrar (painel web).
5. Defina **orçamento mensal** antes de criar agentes.

## Equipe sugerida (cada cargo com a sua regra)
| Cargo | Missão | Regras |
|---|---|---|
| CEO | Recebe a meta e divide em tarefas | Não escreve código; só delega e aprova |
| CTO | Telas, regras do jogo, testes | Segue `AGENTS.md`; `npm run check` verde antes de entregar |
| Designer | Personagens, ilhas, telas | Arte original; nada de marcas de terceiros |
| Professor de conteúdo | Lições do livro, português e inglês | Só mexe em `src/data/` com pedido do dono |
| Privacidade | Revisa LGPD e apps infantis | Bloqueia coleta de nome, e-mail, idade; confere consentimento |

Primeira meta de teste: "Revisar a unidade 1 e propor 5 atividades novas, sem mudar as existentes."

## Segurança
- Um agente por tarefa e por ramo; aceite só PRs com a verificação verde.
- Não coloque chaves (PostHog secreta, Supabase etc.) nos prompts; use variáveis de ambiente.
- Revise o que os agentes mudam antes do merge.
