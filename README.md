# André Mei

Site lifestyle do André Mei, surfista e ultramaratonista do litoral norte de São Paulo.

Feito a partir do protótipo em `reference/Protótipo site André Mei/` (design system, versão
desktop e versão mobile).

## Stack

Next.js 14 (App Router) + React 18 + JavaScript, com `output: 'export'`: o build gera site
100% estático em `out/`. CSS manual em `app/globals.css`, sem Tailwind e sem biblioteca de
UI. Fontes self-hospedadas via `next/font/local`.

```bash
npm run dev      # desenvolvimento (localhost:3000)
npm run build    # gera o site estático em out/ (rode SEMPRE antes de considerar pronto)
```

## Estrutura

```
app/
  layout.jsx          # <html>, next/font, metadata global, noindex, viewport
  (site)/layout.jsx   # skip-link, main#conteudo, Footer, WaFab, Reveal, CursorPrancha
  (site)/page.jsx     # a home inteira
  globals.css         # TODOS os estilos
  fonts/              # Anton e Archivo em woff2 (latin e latin-ext)
  robots.js, sitemap.js, not-found.jsx, icon.png, apple-icon.png
components/
  content.jsx         # FONTE ÚNICA de conteúdo
  seo.js, JsonLd.jsx, Footer.jsx, WaFab.jsx
  AguaHero.jsx        # a água do hero em WebGL
  Contador.jsx        # números que sobem de zero
  CursorPrancha.jsx   # cursor de prancha, só no desktop
  Reveal.jsx          # entrada das seções ao rolar
public/assets/        # webp em várias larguras, geradas dos originais
originais/            # fotos cruas do André, fora do repositório publicado
reference/            # o protótipo que originou o site
```

`originais/`, `assets/` e `reference/` estão no `.gitignore`: material cru não faz parte do
site.

## Conteúdo: edite em `components/content.jsx`

Fonte única de textos, números, fotos e contatos. Não espalhe conteúdo pelas páginas.

## O que precisa acontecer antes de publicar

1. **Registrar o domínio**, no CPF do André, com o contato administrativo no e-mail dele. O
   site está escrito para `andremei.com.br`, que **ainda não foi confirmado como disponível**
   no registro.br. Se o nome mudar, troque só em `SITE_URL` no `content.jsx`: metadata,
   robots, sitemap e JSON-LD leem de lá.
2. **Tirar o `noindex`.** Está em `app/layout.jsx` (`robots: { index: false }`), de propósito,
   para o site não ser indexado antes de estar no ar no endereço definitivo.
3. Repositório privado, projeto na Vercel (preset **Next.js**), domínio apontado.
4. Depois do ar: Search Console e envio do sitemap.

Conferência antes do push:

```bash
npm run build
node ../../skills/kyber-site/scripts/checar.mjs ./out --dominio https://andremei.com.br
```

## A seção do YouTube

Mostra o último vídeo do canal (capa que vira player no clique) mais 4 prévias que levam
para o YouTube.

```bash
npm run videos   # atualiza a lista e as capas
```

A lista sai do feed público do canal, não de edição manual. O script grava
`components/videos.json` e as capas em `public/assets/yt/`, e **o resultado é commitado**.
Ele não roda no build de propósito: na Vercel o `sharp` não existe e as capas cairiam de
volta para o servidor do YouTube.

Quem mantém isso em dia sozinho é o `.github/workflows/videos.yml`: roda toda madrugada, e
só comita (e portanto só dispara deploy) se saiu vídeo novo. Dá para rodar na hora pela aba
Actions do GitHub.

O iframe do YouTube **só carrega depois do clique**. Antes disso a página não chama nenhum
domínio do Google: nada de cookie de rastreio em quem só passou pelo site, e nada dos ~700 KB
de script que o embed normal traz.

## Decisões que não são óbvias

**Os nomes dos arquivos de imagem descrevem a foto**, não o número da câmera. `IMG_5489`
virou `hero-onda`, `IMG_0896` virou `sobre-olhando-para-tras`. Quem abrir a pasta daqui a um
ano entende o que é cada uma sem abrir as oito.

**A água do hero é WebGL, e é opcional por construção.** A foto está no HTML como `<img>`
normal, com `fetchPriority="high"`: ela é o LCP. O canvas desenha por cima só depois que o
shader compila e a textura sobe. Se o WebGL não existir, se o contexto se perder, ou se a
pessoa pedir menos movimento, a foto continua lá e ninguém percebe falta.

Dois detalhes que custaram depuração e é melhor não desfazer:

- A textura **sempre passa por um canvas 2D intermediário**, nunca pela tag de imagem direta.
  Com a imagem direta, em tela estreita o `texImage2D` não lançava exceção: ele marcava
  `INVALID_OPERATION` calado, o código achava que tinha dado certo e a água ficava desligada
  sem nenhum sintoma.
- O resultado é conferido por **`gl.getError()`**, não por `try/catch`. `texImage2D` não
  lança, ele sinaliza. Sem checar, o estado "pronto" mentia.

**O reveal falha aberto, em três camadas.** O estado escondido só existe sob `html.js` (sem
JavaScript, tudo aparece); o observer também aceita elemento que já está acima da dobra
(rolagem rápida pulava o instante em que ele cruzaria a margem, e o painel de números ficava
invisível para sempre); e um timeout de 4s mostra o que sobrar. Animação realça, ela nunca
pode ser a única coisa que torna o conteúdo visível.

**O laranja tem duas versões.** O `--sol` (#DE8A3F) tem 2,3:1 sobre o fundo claro, o que
reprova em acessibilidade para texto. Ele serve de **fundo** de botão (aí o contraste é do
texto escuro sobre ele, 5,1:1). Para **rótulo sobre fundo claro** existe o `--sol-texto`
(#9C561A), que dá 4,8:1 e mantém o mesmo tom. O protótipo usava o tom claro nos dois casos.

**O cursor de prancha só troca depois que o JS confirma que está desenhando.** A classe
`cursor-proprio` entra no `<body>` no primeiro movimento do mouse, e é ela que esconde o
cursor do sistema. Se o script falhasse antes disso, a página ficaria sem cursor nenhum.
Toque na tela devolve o cursor normal.

**Os contadores nascem com o valor final no HTML do servidor.** A animação só substitui um
número que já estava certo, então sem JavaScript (ou com reduced-motion) lê-se 53 e 2.050.

**`<img>` comum, não `next/image`:** em `output: 'export'` o `next/image` não otimiza nada.

**O `npm audit` acusa vulnerabilidades no Next 14.2.35 e elas não se aplicam aqui.** Todas
são server-side (Image Optimizer, Server Components, Server Actions, rewrites, middleware) e
este site é export estático: não há servidor Next rodando. A versão está pinada igual à do
kounting, de propósito, para os dois sites não divergirem.

## Conferido

Chrome com GPU de verdade, sobre o build (`out/`), em 320, 360, 390, 768, 1024, 1366 e 1440 px:

- Sem rolagem horizontal em nenhuma largura
- Sem erro no console, sem requisição falhando, nenhuma imagem quebrada
- Água ligando nas sete larguras, contadores parando em 53 e 2.050
- Todos os alvos de toque com 44px ou mais
- Ordem de foco pelo teclado coerente, foco visível, galeria alcançável, skip-link movendo a tela
- Com `prefers-reduced-motion`: água, letreiro, dica e cursor desligam, números no valor final
- Reveal conferido nos dois casos que quebravam: salto direto para o fim da página e página
  parada sem rolar
- Seção do YouTube: **zero domínio externo chamado antes do clique** no play, e o iframe
  aparecendo só depois (conferido interceptando as requisições). Alvos de toque medidos pela
  área real de clique, não pela caixa do texto
- `npm run build` limpo, e `checar.mjs` sobre o `out/` com 0 erro e 0 aviso (simulando
  produção, sem o noindex)

**Não conferido:** Safari e iOS de verdade (o WebGL foi testado só no Chrome/ANGLE), e
Lighthouse, que depende do site no ar.

## Fatos e limites do conteúdo

Os números da ultramaratona vêm do print do Strava que o André mandou, em
`originais/evidencia-ultramaratonista-andre-mei.png`. O site diz que a prova de 106 km **não
foi concluída** e que ele parou no km 53: isso é proposital e não deve ser suavizado. A nota
explicando a diferença entre os 73,11 km do app e os 53 km no chão existe porque sem ela os
dois números se contradizem.

O chip **Guinness Book** entrou porque o Igor confirmou. A menção original vinha só da bio
das redes do André, sem registro público encontrado.

O site **não promete resultado** para marca nenhuma, e não tem número de seguidores, alcance
ou métrica de audiência. Se for para entrar algo assim, precisa vir do André com o número
real.
