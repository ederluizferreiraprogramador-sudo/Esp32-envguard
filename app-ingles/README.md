# Aplicativo de Inglês

App web (PWA) para estudar inglês, pensado para falantes de português.

## MVP (esta versão)
- **Flashcards** com repetição espaçada simples (sistema de caixas de Leitner)
- **Quiz** de múltipla escolha
- **Pronúncia** via Web Speech API (síntese de voz do navegador)
- Progresso salvo em `localStorage`
- Funciona offline (service worker)

## Como rodar
```bash
cd app-ingles
python3 -m http.server 8000
# abra http://localhost:8000
```

## Estrutura
- `index.html` — telas e navegação
- `style.css` — estilos (tema claro/escuro)
- `app.js` — lógica de flashcards, quiz e progresso
- `data/vocab.js` — vocabulário (fácil de expandir)
- `sw.js` / `manifest.json` — PWA offline e instalável

## Roadmap
1. Mais vocabulário por níveis (A1–B2) e categorias
2. Exercícios de escuta e de escrita
3. Lições de gramática
4. Streak diário e metas
5. Conta de usuário e sincronização (backend)
6. Reconhecimento de fala para praticar pronúncia
