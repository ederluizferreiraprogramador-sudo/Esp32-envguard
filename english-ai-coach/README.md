# English AI Coach

App de inglês para brasileiros (A1), com conteúdo na **ordem das unidades do livro-base** (*Interchange Intro*, 16 unidades), exemplos originais, servidor **MCP** e fluxo de trabalho com **Paperclip**.

| Pasta | O quê |
|---|---|
| `docs/PASSO-A-PASSO.md` | Configuração inicial em etapas (comece aqui) |
| `docs/CURRICULO.md` | As 16 unidades: temas, gramática, vocabulário |
| `docs/PROMPT-LOVABLE.md` | Prompt para validar a ideia na web |
| `content/curriculum.json` | Conteúdo estruturado (fonte única) |
| `mcp-server/` | Servidor MCP em Python (currículo, quiz, progresso) |
| `prototype-pwa/` | Primeiro protótipo web (flashcards/quiz simples) |
| `books/` | PDFs locais — **ignorados pelo Git** |

## Decisões
1. Validar primeiro na web (Lovable/PWA), depois app nativo.
2. Nativo: Kotlin + Jetpack Compose (Android); iPhone via Kotlin Multiplatform, mais tarde.
3. Conteúdo segue a ordem do livro, mas é original: não versionamos PDFs nem copiamos exercícios.
4. O MCP, que a especificação v1.0 deixava fora do MVP, passa a fazer parte.
