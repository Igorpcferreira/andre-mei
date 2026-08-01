# CLAUDE.md · Site do Andre Mei

Instruções para qualquer agente trabalhando neste repositório. Leia antes de editar.

## Regra nº 1 (inviolável): NUNCA usar travessão

**Nunca escreva travessão (`—`, em dash) em lugar nenhum do site.** Nem em texto, título,
`alt`, `aria-label`, metadata ou comentário. Use vírgula, ponto, dois-pontos, parênteses ou
`·`. Antes de finalizar qualquer edição, busque o caractere no diff: tem que dar zero.

## O que é

Site lifestyle do **Andre Mei** (o nome dele é **sem acento**: nunca escreva "André"),
surfista e ultramaratonista adolescente do litoral norte de
São Paulo. **Não é loja e não é portfólio de serviço:** a única conversão é o contato para
parceria, por WhatsApp ou e-mail. Não adicione formulário, carrinho, newsletter nem chatbot.

O protótipo que originou o site (design system, desktop e mobile) fica em `reference/`.

**Cuidado ao copiar de `reference/`:** aquele material é de antes das correções de 01/08 e
está desatualizado em dois pontos que o Andre pediu para mudar. Ele escreve o nome **com**
acento, e linka o **`@andremeisurf` cinco vezes**, que é a conta privada e não pode voltar ao
site (nem como link, nem no rodapé, nem no `sameAs`). A pasta é ignorada pelo git e não vai
ao ar, mas é de lá que se copia conteúdo. Confira contra o `components/content.jsx`, que é a
fonte de verdade.

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
  alcance ou visualização, tem que vir do Andre com o número real.
- **A prova de 106 km NÃO foi concluída, e o site diz isso.** Ele parou no km 53. Não
  suavize, não escreva "completou", não tire a nota que explica a diferença entre os
  73,11 km do Strava e os 53 km no chão. Esconder isso é o principal risco do texto.
- Fala do Andre entre aspas, em primeira pessoa, só quando for citação real dele.
- **Nunca escreva a idade dele na mão.** Ela sai de `NASCIMENTO` (06/01/2009) pela função
  `idadeEm()`, em `content.jsx`, e entra por `chipsCom()` e `sobreCom()`. Antes era "17 anos"
  fixo em cinco lugares, e viraria mentira no primeiro 06/01. O "aos 16 anos" da seção da
  ultramaratona é outra coisa, e continua fixo: é quando a prova aconteceu, fato com data.
  O workflow de vídeos roda toda madrugada, então o número se acerta sozinho no primeiro
  build depois do aniversário.

## Seção "Rumo ao topo do mundo"

Os picos que o Andre ainda quer conhecer, com a promessa de registrar tudo no canal. **Nada
ali aconteceu**, e o texto e o desenho existem para dizer isso: os marcadores são círculos
vazados (não check de lista feita) e a legenda diz "nenhum riscado ainda".

Se for mexer: não escreva no passado, não escreva "conquistando", e não invente patrocínio,
convite ou prova marcada. Se um dia ele for a um dos lugares, aí vira registro, com vídeo e
data.

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
  desescapa entidade XML. **Emoji fica**: quem usou primeiro foi o próprio Andre, no título
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
- **`sizes` com `object-fit: cover` não é `100vw`.** Se a foto for mais larga em proporção
  que a tela, quem manda no `cover` é a ALTURA, e a foto é desenhada mais larga que a janela:
  a paisagem 3:2 numa tela de 390x844 ocupa 1266px, não 390. Com `sizes="100vw"` o navegador
  escolhia um arquivo pequeno e ampliava 2,6x, e o hero saía borrado no celular. A conta é
  `altura × razão da foto`: `150vh` para 3:2 e `75vh` para 3:4.
- **O `object-position` do hero muda por proporção de tela, e isso não é enfeite.** Com
  `cover` e altura de 100svh, quanto mais larga a tela, mais a foto 3:2 sobra em altura e
  mais o corte come em cima. Com o valor fixo de 42% a cabeça do Andre saía do quadro em
  ultrawide de 34" (~21:9), e ficava apertada já em 16:9. Os degraus em `globals.css`
  (8/5 → 34%, 16/9 → 28%, 2/1 → 22%, 12/5 → 18%) seguem essa curva. Se for mexer, teste em
  21:9 e não só na tela em que você está: no notebook o defeito não aparece.
- **O hero tem dois enquadramentos, não só dois tamanhos.** Até 859px entra o recorte retrato
  3:4 (`hero-onda-retrato-*`), acima disso a paisagem (`hero-onda-*`), por `<picture>`. Sem
  isso a foto paisagem teria que ser ampliada além da própria resolução para cobrir uma tela
  de celular. O `.hero picture` é `display: contents`: quem posiciona é o `<img>`.
- **Foto em carrossel: defina a LARGURA e deixe a altura sair do `aspect-ratio`.** O
  contrário (altura fixa + `width: auto`) não preserva proporção dentro de um flex: a largura
  é resolvida pelo atributo `width` do HTML e depois espremida junto com as irmãs. Foi assim
  que a galeria chegou a 354x439 numa foto 900x600, com o Andre achatado. E nada de
  `max-height` junto com `aspect-ratio`: quando ele morde, a proporção quebra de novo.
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
  O domínio vai no **CPF do Andre**, com o contato administrativo no e-mail dele.
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
