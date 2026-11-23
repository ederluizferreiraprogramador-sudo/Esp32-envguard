# FenixInglês — especificação para o Base44

App de inglês para brasileiros iniciantes (A1), estilo de gamificação do Duolingo, marca própria.
Interface em português, conteúdo em inglês. Mobile-first. Sem login por enquanto: progresso e erros no localStorage.

## Visual
- Fonte Nunito 700/800, cantos bem arredondados, botões "3D" (box-shadow 0 4px 0 de cor mais escura; afundam ao clicar).
- Cores: verde #58CC02 (sombra #58A700), azul #1CB0F6 (#1899D6), vermelho #FF4B4B (#EA2B2B), amarelo #FFC800, laranja #FF9600, cinza #E5E5E5, texto #4B4B4B, fundo branco.
- Mascote: fênix laranja/vermelha em SVG, com CHAMAS na cabeça e asas de fogo (não pode parecer coruja; não usar marca do Duolingo).

## Telas
1. Trilha (/): barra superior com 🔥 sequência, 💎 XP, ❤️ vidas (5). 16 unidades na ordem dos arquivos de dados, cada uma com cabeçalho colorido ("UNIDADE N" + título; cores alternando verde, azul, laranja, vermelho) e 3 bolinhas grandes em zigue-zague (uma por lição). Lição atual verde pulsando com balão "COMEÇAR"; concluídas douradas com 👑; futuras cinza com 🔒. Unidade com todas as lições concluídas mostra link "📄 Resumo de erros". Navegação inferior: Trilha / Perfil.
2. Lição (/lesson/:unit/:lesson): ✕ para sair, barra de progresso verde, ❤️. Uma atividade por vez, botão "VERIFICAR". Faixa inferior verde "Muito bem!" ou vermelha "Resposta correta: ..." + explicação, botão "CONTINUAR". Errar tira 1 vida, registra o erro (recordMistake) e a questão volta no fim.
3. Fim da lição: fênix comemorando, +10 XP, % de acertos, sequência. Se a unidade inteira ficou concluída: texto "Unidade concluída! Veja onde você pode melhorar." e Continuar leva ao resumo da unidade.
4. Resumo da unidade (/unit-summary/:unit): ver arquivo unit-summary.$unitId.tsx — erros agrupados por categoria, dica de como melhorar, "Você respondeu / Certo / Por quê", botão "📄 Baixar PDF com explicações" (mistakesPdf.ts, jsPDF).
5. Perfil: XP, sequência, lições concluídas, liga/desliga sons, botão "🔊 Testar áudio" (fala "Hello! Welcome to FenixInglês." e mostra quantas vozes em inglês existem), botão "Zerar progresso" (apaga progresso e erros).

## Atividades (tipos em units.ts)
- fill: "Complete o diálogo" — mostra context (opcional) e a frase before ___ after; opções em botões.
- choose: "Escolha a resposta correta" — fala (com 🔊) e opções.
- listen: "Ouça e escolha o que você ouviu" — botão 🔊 grande + 🐢 (devagar, rate 0.6); opções.
- write: "Escreva em inglês" — prompt grande + campo de texto; aceita qualquer item de answer (ignorar maiúsculas, pontuação e espaços extras).
- build: "Traduza esta frase" — frase em português; blocos = palavras da resposta + extra, embaralhados; tocar adiciona/remove; correto se igual à resposta (normalizado).
- match: "Ligue os pares" — duas colunas embaralhadas; par certo fica verde, errado treme vermelho; concluído quando todos os pares forem ligados.
Opções sempre embaralhadas.

## Áudio (importante: Android)
Web Speech API, voz en-US. No Chrome Android: carregar vozes também no evento voiceschanged; escolher en-US, senão qualquer en-*; só chamar cancel() se speaking||pending; falar dentro de setTimeout(50) depois de resume(); manter referência da utterance; se onstart não disparar em 2 s ou houver onerror, mostrar aviso (uma vez por sessão): "Não consegui tocar o áudio. Abra o app no Chrome e confira em Configurações › Idiomas › Saída de conversão de texto em voz se há voz em inglês instalada."
Sons de acerto/erro/fim com WebAudio (osciladores curtos), desligáveis no Perfil.

## Regras de progresso
- Vidas recarregam para 5 a cada novo dia; sem vidas, oferecer "Recarregar vidas".
- Sequência: +1 se estudou ontem, reinicia se pulou um dia.
- Lições liberadas em ordem; concluídas podem ser refeitas.
