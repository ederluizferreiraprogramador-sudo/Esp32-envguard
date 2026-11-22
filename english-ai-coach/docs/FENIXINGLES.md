# FenixInglês — plano simples

App de inglês no estilo de gamificação do Duolingo, com marca própria (mascote: fênix).
Sem HTML feito à mão: construído por plataformas no-code com IA.

## Onde está
- **Lovable (principal):** https://lovable.dev/projects/60981d66-8189-4a20-94de-9a98b00adf52
- **App publicado (testar):** https://fenixingles.lovable.app

## Regras
1. Seguir a **ordem do livro** (16 unidades, ver `CURRICULO.md`) e os **tipos de atividade do workbook**:
   completar diálogo, escolher a resposta certa, montar frase, ouvir e escolher, escrever número por extenso, ligar pares.
2. Conteúdo original (não copiar textos do livro). Fonte: `content/curriculum.json`.
3. Começar simples: sem login, progresso no aparelho. Login/banco só depois de validar.

## Estilo (paleta)
| Uso | Cor |
|---|---|
| Principal / acerto | #58CC02 (sombra #58A700) |
| Secundária | #1CB0F6 |
| Erro | #FF4B4B |
| XP / conquista | #FFC800 |
| Sequência 🔥 | #FF9600 |
| Texto / borda | #4B4B4B / #E5E5E5 |
Fonte Nunito, botões arredondados "3D". Não usar a coruja nem a marca do Duolingo.

## Quando o crédito do Lovable acabar → Base44
1. Copie o prompt de criação (abaixo) para o Base44 ("create app").
2. Cole o conteúdo de `content/curriculum.json` como entidades `Unit` e `Activity`.
3. Mantenha o mesmo visual e a mesma ordem das unidades.
4. Uma unidade por mensagem, para gastar menos crédito.

## Próximos pedidos (um por vez, para economizar crédito)
1. Unidades 3 e 4 (conteúdo completo).
2. Unidades 5–8.
3. "Progress Check" a cada 2 unidades (revisão).
4. Unidades 9–16.
5. Login e progresso na nuvem.
6. App Android nativo (Kotlin + Compose) depois de validado.
