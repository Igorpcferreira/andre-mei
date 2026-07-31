# CLAUDE.md · Site do André Mei

Instruções para qualquer agente trabalhando neste repositório. Leia antes de editar.

## Regra nº 1 (inviolável): NUNCA usar travessão

**Nunca escreva travessão (`—`, em dash) em lugar nenhum do site.** Nem em texto, título,
`alt`, `aria-label`, metadata ou comentário. Use vírgula, ponto, dois-pontos, parênteses ou
`·`. Antes de finalizar qualquer edição, busque o caractere no diff: tem que dar zero.

## O que é

Site lifestyle do **André Mei**, surfista e ultramaratonista de 17 anos do litoral norte de
São Paulo. **Não é loja e não é portfólio de serviço:** a única conversão é o contato para
parceria, por WhatsApp ou e-mail. Não adicione formulário, carrinho, newsletter nem chatbot.

O protótipo que originou o site (design system, desktop e mobile) fica em `reference/`.

## Stack

- **Next.js 14.2.35** (App Router) + **React 18** + **JavaScript** (`.jsx`), com
  **`output: 'export'`**: o build gera site 100% estático em `out/`. Sem TypeScript, sem
  Tailwind, sem CDN, sem biblioteca de UI.
- **CSS manual** em `app/globals.css`, com tokens em `:root` (paleta do Design System v1:
  Mar Profundo `#07332C`, Espuma `#F3EEE2`, Sol `#DE8A3F`, Tinta `#14231F`).
- Fontes self-hospedadas em `app/fonts/` via `next/font/local`: **Anton** (display, var
  `--font-display`) e **Archivo** variável (corpo, var `--font-body`), nos subconjuntos
  latin e latin-ext. **Nada de Google Fonts por requisição**: os woff2 estão commitados.
- Animação em JS nativo, sem biblioteca. Tudo checa `prefers-reduced-motion` antes de rodar
  e falha para o estado visível.

## Comandos

```bash
npm run dev      # desenvolvimento (localhost:3000)
npm run build    # gera o site estático em out/ (rode SEMPRE antes de considerar pronto)
```

## Conteúdo: edite em `components/content.jsx`

Fonte única de textos, números, fotos e contatos. Não espalhe conteúdo pelas páginas.

## Regras de copy

- Tom direto, jovem, frases curtas, PT-BR tratando por você. Sem clichê de agência
  ("atleta de excelência", "referência no cenário").
- **Não prometa resultado** para marca nenhuma: nem alcance, nem retorno, nem pódio.
- **Não invente número.** Não há métrica de audiência confirmada: se entrar seguidor,
  alcance ou visualização, tem que vir do André com o número real.
- **A prova de 106 km NÃO foi concluída, e o site diz isso.** Ele parou no km 53. Não
  suavize, não escreva "completou", não tire a nota que explica a diferença entre os
  73,11 km do Strava e os 53 km no chão. Esconder isso é o principal risco do texto.
- Fala do André entre aspas, em primeira pessoa, só quando for citação real dele.

## Seção do YouTube

O último vídeo do canal, mais 4 prévias. A lista **não se edita na mão**: sai do
`scripts/buscar-videos.mjs`, que lê o feed público do canal (`UC109LgXZ9ThI0BNtslQgAiQ`),
baixa as capas e grava `components/videos.json` + `public/assets/yt/*.webp`.

```bash
npm run videos   # atualiza a lista e as capas (instala o sharp sem salvar)
```

- **O resultado é commitado**, e é isso que a Vercel publica. O script **não** roda no build
  de propósito: na Vercel o sharp não existe, e as capas cairiam de volta para o
  `i.ytimg.com`, reintroduzindo requisição a terceiro sem ninguém notar.
- Um workflow do GitHub (`.github/workflows/videos.yml`) roda isso toda madrugada e só comita
  se mudou alguma coisa. É ele que mantém a seção em dia sozinha.
- **Feed RSS, não API do YouTube:** é público, não pede chave, não tem cota. Chave seria mais
  um segredo para guardar e mais uma coisa para expirar calado.
- **O iframe só entra no DOM depois do clique** (`VideoDestaque.jsx`). Antes disso a página
  não chama nenhum domínio do Google, o que evita ~700 KB de script e o cookie de rastreio em
  quem só passou pelo site (resolve a LGPD sem banner). Verificado: zero domínio externo
  antes do clique. Use `youtube-nocookie.com`, não `youtube.com`.
- **Título de vídeo vem cru do YouTube.** O script troca travessão por `·` (regra nº 1) e
  desescapa entidade XML. **Emoji fica**: quem usou primeiro foi o próprio André, no título
  dele.
- **As prévias não abrem player no site**, levam para o YouTube: é o destino que a seção
  existe para alimentar. O card inteiro é clicável (o link do título se estica com
  `::after`), senão o alvo seria só o texto, com 39px.
- **`haQuantoTempo()` recebe a data de fora**, do `HOJE` congelado no build. Não chame
  `new Date()` dentro do componente: o HTML é gerado uma vez, e servidor e navegador
  calculando com relógios diferentes dão erro de hidratação.

## Convenções técnicas e armadilhas

- **Imagens:** `<img>` (não `next/image`, que não otimiza em export estático) com
  `width`/`height` REAIS, `loading="lazy"` (hero `eager` + `fetchPriority="high"`),
  `decoding="async"`, `alt` descritivo. Converta com sharp (`npm i --no-save sharp`,
  desinstale depois). Nome de arquivo descreve a foto, não o número da câmera.
- **A água do hero (`AguaHero.jsx`) é opcional por construção.** A foto é o LCP e vem no
  HTML; o canvas desenha por cima só depois que a textura sobe. Dois detalhes que não devem
  ser desfeitos: a textura **sempre passa por um canvas 2D intermediário** (com a tag de
  imagem direta, o `texImage2D` marcava `INVALID_OPERATION` calado em tela estreita e a água
  ficava desligada sem sintoma), e o resultado é conferido por **`gl.getError()`**, porque
  `texImage2D` não lança exceção.
- **Reveal falha aberto, em três camadas:** escondido só sob `html.js`, observer que aceita
  elemento já acima da dobra, e timeout de 4s como rede. Não remova nenhuma: rolagem rápida
  já deixou o painel de números invisível para sempre.
- **Contadores nascem com o valor final no HTML.** A animação substitui um número que já
  estava certo, então sem JS ou com reduced-motion lê-se 53 e 2.050.
- **Contraste:** o `--sol` (#DE8A3F) tem 2,3:1 sobre a Espuma. Ele é **fundo** de botão,
  nunca cor de texto em seção clara. Para rótulo sobre fundo claro use `--sol-texto`
  (#9C561A, 4,8:1). A camada `.claro` já faz essa troca.
- **Cursor de prancha:** a classe `cursor-proprio` entra no `<body>` só no primeiro
  movimento do mouse, e é ela que esconde o cursor do sistema. Se esconder antes, JS quebrado
  deixa a página sem cursor nenhum.
- **Metadata:** use `pageMeta()` de `components/seo.js`. No App Router o `openGraph` da
  página substitui o do layout inteiro (não faz merge).
- **`sitemap.js`:** `lastModified` sai de `REVISADO_EM` (fixo). Não usar `new Date()`.
- **Skip-link:** aponta para `main#conteudo`, que precisa de `tabIndex={-1}` para o atalho
  mover a tela, e não só o foco.
- **Rodapé:** o selo "Desenvolvido por Kyber Tech" (link para `somoskyber.com.br`, com
  `?origem=selo-andre-mei`) é obrigatório. Não remova.
- **Linux é case-sensitive** (a Vercel builda em Linux): caminho de imagem tem que bater
  maiúscula e minúscula exatamente.

## Domínio e deploy

- **PENDENTE:** `andremei.com.br` ainda **não foi confirmado como disponível** no registro.br.
  O domínio vai no **CPF do André**, com o contato administrativo no e-mail dele.
- `SITE_URL` vive em `components/content.jsx` e alimenta metadata, robots, sitemap e JSON-LD.
  Se o domínio mudar, troque só lá.
- **O `noindex` está ligado de propósito** em `app/layout.jsx`, e só sai quando o domínio
  definitivo estiver no ar.
- Repositório: `https://github.com/Igorpcferreira/andre-mei`. Hospedagem alvo: Vercel, preset
  **Next.js** (ela acha o `out/` sozinha).
- O `npm audit` acusa vulnerabilidades no Next 14.2.35: todas são server-side e **não se
  aplicam** a export estático. A versão está pinada igual à do kounting, de propósito.

## Antes de finalizar

1. `npm run build` passa limpo.
2. Zero travessões (`—`) no diff.
3. `node ../../skills/kyber-site/scripts/checar.mjs ./out --dominio https://andremei.com.br`
4. Verifique desktop e mobile (sem overflow horizontal; headlines não estouram em ~360px).
