# Visual Developer MCP

Servidor MCP local para Claude Code, baseado na linha atual v2 do SDK TypeScript oficial. Permite inspecionar um projeto web, receber imagens de referência, ler arquivos, criar backups, atualizar HTML/CSS/JavaScript, validar referências e capturar screenshots em Chromium.

## Segurança e limites

- O servidor usa transporte **stdio**; não abre uma porta de rede.
- O acesso fica limitado a `VISUAL_PROJECT_ROOT`.
- Caminhos devem ser relativos; caminhos absolutos, traversal (`..`) e symlinks são rejeitados.
- Escrita restrita a `.html`, `.htm`, `.css`, `.js`.
- Arquivos existentes são copiados para `.visual-developer/backups/` antes da gravação (por padrão).
- Limite de leitura: 1 MB; limite de imagem: 12 MB.
- O servidor não executa comandos shell recebidos da IA.
- A ferramenta de screenshot apenas abre um HTML local em Chromium; recursos remotos referenciados pela página podem ser carregados pelo navegador.
- Use apenas em projetos seus ou para os quais tenha autorização. Não use para copiar código ou ativos proprietários de terceiros.

A IA ainda pode propor alterações incorretas. Revise diffs e backups, mantenha Git e não permita escrita em pastas com segredos ou dados de produção.

## Requisitos

- Node.js LTS e npm. O SDK v2 atual usa os pacotes `@modelcontextprotocol/server` e `zod/v4`.
- Claude Code.
- Mac Apple Silicon (M1) ou Windows 10/11.
- Opcional: Chromium para Playwright.

Baixe Node.js LTS: https://nodejs.org/en/download/

## Instalação

1. Extraia a pasta `visual-developer-mcp` em um local estável:
   - macOS: `~/Tools/visual-developer-mcp`
   - Windows: `C:\Users\SEU_USUARIO\Tools\visual-developer-mcp`
2. Abra um terminal nessa pasta.
3. Instale e compile:

```bash
npm install
npm run build
npx playwright install chromium
```

No Windows PowerShell, os mesmos comandos funcionam no terminal integrado do VS Code.

## Preparar o projeto FenixIngles

Aponte `VISUAL_PROJECT_ROOT` para a pasta raiz que contém o HTML, CSS e JavaScript. Exemplo:
- macOS: `/Users/seuusuario/Projects/FenixIngles`
- Windows: `C:\Users\seuusuario\Projects\FenixIngles`

Recomendação: inicialize Git no projeto antes de permitir edições:

```bash
git init
git add .
git commit -m "backup antes do Visual Developer MCP"
```

Não coloque `.env`, chaves de API, credenciais ou dados pessoais dentro da pasta autorizada para edição.

## Conectar ao Claude Code

Copie o exemplo correspondente e ajuste os caminhos reais.

### macOS
Copie `claude-code.mcp.mac.example.json` para `.mcp.json` na raiz do projeto FenixIngles. Corrija `SEU_USUARIO` nos dois caminhos.

### Windows
Copie `claude-code.mcp.windows.example.json` para `.mcp.json` na raiz do projeto FenixIngles. Corrija `SEU_USUARIO` nos dois caminhos.

Depois, abra Claude Code na pasta do projeto. O arquivo `.mcp.json` é uma configuração de projeto; Claude Code pode solicitar que você aprove o servidor na primeira utilização. Verifique a conexão com:

```text
/mcp
```

Se a versão instalada do Claude Code não carregar o `.mcp.json`, use a configuração local via CLI:

```bash
claude mcp add --transport stdio --scope local visual-developer -- node /CAMINHO/ABSOLUTO/visual-developer-mcp/dist/index.js
```

No Windows, substitua o caminho pelo caminho absoluto Windows. Configure `VISUAL_PROJECT_ROOT` no ambiente antes de iniciar o Claude Code, ou prefira o `.mcp.json` com `env`.

## Ferramentas disponíveis

- `project_overview`: inventário de arquivos.
- `read_project_file`: lê HTML/CSS/JS/JSON/MD/SVG.
- `analyze_reference_image`: devolve a imagem ao modelo para análise visual.
- `backup_project_file`: backup individual.
- `write_project_file`: grava HTML/CSS/JS com backup automático.
- `validate_project`: verifica referências locais e sintaxe JavaScript.
- `capture_html_screenshot`: captura screenshot mobile/desktop usando Chromium.

## Fluxo recomendado

1. Coloque a imagem de referência dentro do projeto, por exemplo `references/tela-home.png`.
2. Peça: “Use `analyze_reference_image` em `references/tela-home.png` e descreva os elementos visuais.”
3. Peça para usar `project_overview` e `read_project_file` nos arquivos relevantes.
4. Solicite um plano antes de qualquer alteração.
5. Após aprovar o plano, peça a atualização de arquivos específicos com `write_project_file`.
6. Execute `validate_project`.
7. Execute `capture_html_screenshot` com `width=390`, `height=844`.
8. Revise o resultado e mantenha o backup.

## Exemplo de solicitação ao Claude Code

“Analise `references/tela-home.png`. Inspecione a estrutura atual do FenixIngles. Não altere arquivos ainda. Proponha um plano para reproduzir a hierarquia visual, cores, espaçamentos, cartões e navegação, mantendo acessibilidade e responsividade. Liste os arquivos que precisariam mudar. Aguarde minha aprovação.”

Depois de aprovar:

“Atualize somente os arquivos HTML/CSS/JS necessários. Preserve as funcionalidades existentes, faça backup automático, não remova conteúdo sem autorização, valide o projeto e gere screenshot em 390x844.”

## Diagnóstico

- `/mcp` no Claude Code: verifique se `visual-developer` aparece conectado.
- Se o servidor não iniciar: execute `node dist/index.js` no terminal; confirme `VISUAL_PROJECT_ROOT`.
- Se screenshot falhar: execute `npx playwright install chromium`.
- Se `npm install` falhar: confira `node --version` e `npm --version`, e use uma versão LTS suportada.

## Importante sobre imagem

O servidor recebe imagens que estejam salvas no projeto e as devolve ao modelo como conteúdo visual MCP. Para anexar uma imagem diretamente na conversa do Claude Code, use também o recurso nativo de anexos da própria IDE; o servidor não captura automaticamente a tela do computador.

## Ajustes feitos no FenixInglês (nov/2026)

- Tipos explícitos nos handlers das ferramentas: `npm run build` agora compila sem erros (antes falhava em `noImplicitAny`).
- `VISUAL_CHROMIUM_PATH` (opcional): caminho de um Chromium já instalado para `capture_html_screenshot`, útil quando a versão do Playwright não bate com o navegador instalado.
- Testado via stdio: `project_overview`, `read_project_file` (bloqueia `../`), `validate_project` e `capture_html_screenshot` (390×844).
- Observação: a versão de teste publicada como Artifact é um fragmento HTML (a plataforma acrescenta `<html>/<head>/<body>`), por isso `validate_project` avisa sobre essas tags — é esperado.
