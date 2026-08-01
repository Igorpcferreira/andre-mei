// FONTE ÚNICA de conteúdo do site do Andre Mei.
// Textos, números, fotos e contatos vivem aqui. Não espalhe conteúdo pelas páginas.

// PENDENTE: o domínio ainda não foi registrado. Confirme a disponibilidade no registro.br,
// no CPF do Andre, antes de publicar. Mudou o nome? Troque só aqui: sitemap, robots,
// metadata e JSON-LD leem desta constante.
export const SITE_URL = 'https://andremei.com.br';

export const WHATSAPP = 'https://wa.me/5511993422620';
export const WHATSAPP_NUMBER = '5511993422620';
export const EMAIL = 'andremeisurff@gmail.com';
export const INSTAGRAM = 'https://www.instagram.com/andremeii/';
export const INSTAGRAM_HANDLE = '@andremeii';
// O @andremeisurf saiu do site a pedido do Andre: a conta é privada e ele quer manter assim.
// Não recoloque, nem no rodapé, nem no sameAs do JSON-LD.
export const YOUTUBE = 'https://www.youtube.com/@andremeii';
export const LOCAL = 'Litoral norte de São Paulo';

// Monta link do WhatsApp com mensagem pré-preenchida. O 2º argumento marca de onde saiu o
// contato: hoje vira só parâmetro, mas quando houver medição troca-se a implementação aqui,
// sem caçar link espalhado pelo site. Todo CTA passa por esta função, nada de wa.me na mão.
export function wa(text, origem) {
  const base = `${WHATSAPP}?text=${encodeURIComponent(text)}`;
  return origem ? `${base}&origem=${encodeURIComponent(origem)}` : base;
}

export const NOME = 'Andre Mei';
export const RESUMO = 'Surfista e ultramaratonista';

// ── Identidade ───────────────────────────────────────────────────────────────

// Data de nascimento do Andre. A idade NÃO se escreve na mão em lugar nenhum: sai daqui,
// senão o site envelhece mentindo (era "17 anos" fixo, e viraria erro em 06/01).
export const NASCIMENTO = '2009-01-06';

// Idade completa em anos na data de referência. Recebe a data de fora, do HOJE congelado no
// build, pelo mesmo motivo do `haQuantoTempo()`: o HTML é gerado uma vez, e servidor e
// navegador calculando com relógios diferentes dariam erro de hidratação.
//
// A conta é feita em cima das partes da data, não em milissegundos: dividir por 365,25 erra
// justamente no dia do aniversário, que é o único dia em que o número muda.
export function idadeEm(agoraISO, nascimentoISO = NASCIMENTO) {
  const [an, mn, dn] = nascimentoISO.split('-').map(Number);
  const [ah, mh, dh] = agoraISO.slice(0, 10).split('-').map(Number);
  let anos = ah - an;
  // Ainda não fez aniversário este ano: tira um.
  if (mh < mn || (mh === mn && dh < dn)) anos -= 1;
  return anos;
}

// Os chips do hero. A idade entra montada, com a data de referência do build.
export function chipsCom(agoraISO) {
  return [
    'Surfista',
    'Ultramaratonista',
    `${idadeEm(agoraISO)} anos`,
    'Litoral norte de SP',
  ];
}

// O Igor confirmou a menção ao Guinness Book, que originalmente vinha só da bio das redes
// do Andre. Fica destacado (borda Sol) por ser o selo da vez.
export const chipDestaque = 'Guinness Book';

export const letreiro = [
  'Surf',
  'Ultra',
  'Litoral norte',
  'Insólito',
  'Rumo ao topo do mundo',
];

// Fala do próprio Andre, da descrição oficial do canal do YouTube. Entre aspas porque é
// citação, não texto nosso.
export const falaAndre =
  'Vivo no litoral paulista, surfando e vivendo muito. Me acompanhem em minhas aventuras e na minha jornada rumo ao topo do mundo.';

// A idade entra montada (ver `chipsCom`). O "aos 16 anos" logo adiante é outra coisa: é
// quando a prova aconteceu, fato com data, e por isso fica fixo.
export function sobreCom(agoraISO) {
  return `Andre Mei tem ${idadeEm(agoraISO)} anos e vive no litoral norte de São Paulo. Divide os dias entre o mar e a trilha: surfista e ultramaratonista aos 16 anos, ele registra a vida no litoral e os desafios físicos que encara. Insólito é a palavra que ele escolheu para se descrever, e é a que melhor resume o que ele faz.`;
}

// ── O desafio dos 106 km ─────────────────────────────────────────────────────
// Números do print do Strava que o Andre mandou (em originais/). A prova NÃO foi concluída,
// e o site diz isso: não suavize. Sem inventar posição, tempo alvo ou classificação.

export const ultra = {
  rotulo: 'O desafio dos 106 km',
  titulo: 'O número que fica não é o que faltou. É o que ele encarou.',
  texto:
    'A prova alvo tinha 106 km. Andre parou no km 53, depois de mais de 12 horas em movimento e 2.050 m de subida acumulada. Aos 16 anos, correndo distância de ultramaratona.',
  // `contador` liga a animação de subida; sem ele o número é fixo (caso de "12:04:53",
  // que não é quantidade e ficaria estranho subindo).
  numeros: [
    { valor: '106', unidade: 'km', rotulo: 'Prova alvo' },
    { valor: '53', unidade: 'km', rotulo: 'Percorridos no chão', contador: 53 },
    { valor: '2.050', unidade: 'm', rotulo: 'Elevação acumulada', contador: 2050 },
    { valor: '12:04', unidade: ':53', rotulo: 'Tempo total' },
  ],
  nota:
    'Nota sobre os números: no Strava a distância aparece como 73,11 km porque o app soma a elevação ao total registrado. No chão, foram 53 km. O print é o registro original da prova.',
  evidencia: {
    src: '/assets/strava-106km.webp',
    width: 440,
    height: 583,
    alt: 'Print do Strava: tempo total 12:04:53, ritmo médio parcial 2:19:53 e distância registrada de 73,11 km',
    legenda: 'Registro do Strava enviado pelo Andre',
  },
};

// ── Fotos ────────────────────────────────────────────────────────────────────
// Todas as fotos são do próprio Andre. Nome de arquivo descreve a imagem, não o número da
// câmera, e cada uma tem as larguras que o srcset usa.

// O hero tem DUAS versões da mesma foto, e isso não é capricho: ele ocupa a tela inteira com
// `object-fit: cover`, e numa tela de celular (retrato, ~0,46 de razão) a versão paisagem
// precisa ser esticada até ~2,6x para cobrir a altura. Isso borrava a foto no celular, e
// nenhuma qualidade de webp resolve, porque o problema é upscale, não compressão.
//
// A versão `retrato` é um recorte 3:4 do mesmo original, centrado no Andre. Ela entra por
// media query no <picture> até 859px, que é onde o hero é mais alto que largo. Acima disso
// volta a paisagem, que é o enquadramento que a foto pede.
export const heroFoto = {
  base: '/assets/hero-onda',
  larguras: [960, 1440, 2000, 2560, 3200],
  padrao: 1440,
  width: 1440,
  height: 960,
  alt: 'Andre Mei surfando uma onda no litoral norte de São Paulo, com mata verde ao fundo',
};

export const heroFotoRetrato = {
  base: '/assets/hero-onda-retrato',
  larguras: [720, 1080, 1440, 1800, 2160],
  padrao: 1080,
  width: 1080,
  height: 1440,
};

export const sobreFoto = {
  base: '/assets/sobre-olhando-para-tras',
  larguras: [640, 1000],
  padrao: 1000,
  width: 1000,
  height: 666,
  alt: 'Andre Mei olhando por cima do ombro enquanto desce uma onda',
};

export const galeria = [
  {
    base: '/assets/galeria-braco-estendido',
    larguras: [560, 900, 1280],
    padrao: 900,
    width: 900,
    height: 600,
    alt: 'Andre desce a onda com o braço estendido, mata verde ao fundo',
  },
  {
    base: '/assets/galeria-posicao-baixa',
    larguras: [560, 900, 1280],
    padrao: 900,
    width: 900,
    height: 600,
    alt: 'Andre em posição baixa na onda, olhando para a câmera',
  },
  {
    base: '/assets/galeria-prancha-em-pe',
    larguras: [560, 900, 1280],
    padrao: 900,
    width: 900,
    height: 600,
    alt: 'Prancha em pé na água durante uma manobra',
  },
  {
    base: '/assets/galeria-crista-da-onda',
    larguras: [560, 900, 1280],
    padrao: 900,
    width: 900,
    height: 600,
    alt: 'Manobra rasgando a crista da onda, céu azul ao fundo',
  },
  {
    base: '/assets/galeria-base-da-onda',
    larguras: [560, 900],
    padrao: 900,
    width: 900,
    height: 499,
    alt: 'Quadro de vídeo: Andre agachado na base da onda',
  },
  {
    base: '/assets/galeria-espuma',
    larguras: [560, 900],
    padrao: 900,
    width: 900,
    height: 495,
    alt: 'Quadro de vídeo: prancha cortando a espuma da onda',
  },
];

// Monta o srcset a partir da base e das larguras, para não repetir string de caminho.
export function srcSet(foto) {
  return foto.larguras.map((w) => `${foto.base}-${w}.webp ${w}w`).join(', ');
}
export function src(foto) {
  return `${foto.base}-${foto.padrao}.webp`;
}

// ── Canal no YouTube ─────────────────────────────────────────────────────────
// A lista NÃO se edita aqui: ela é gerada pelo scripts/buscar-videos.mjs, que lê o feed do
// público do canal e grava o videos.json. O script roda sozinho antes de cada build (ver o
// "prebuild" no package.json), então o site sobe sempre com o vídeo mais recente.
//
// Para atualizar sem esperar um commit, basta um redeploy na Vercel.

import dadosVideos from './videos.json';

export const CANAL_ID = dadosVideos.canal;
export const videos = dadosVideos.videos;
export const videoDestaque = dadosVideos.videos[0];
export const videosPrevia = dadosVideos.videos.slice(1);

export const youtube = {
  rotulo: 'No canal',
  titulo: 'A jornada em vídeo',
  texto:
    'O Andre grava o que acontece entre uma onda e outra: viagem, treino, campeonato e a rotina no litoral. O último vídeo está aqui, e o resto no canal.',
  chamada: 'Ver tudo no YouTube',
};

// "há 3 dias", "há 2 semanas". Recebe a data de referência de fora para o resultado não
// mudar entre o servidor e o navegador (o build congela o HTML: se cada lado calculasse com
// o próprio relógio, o React acusaria erro de hidratação).
export function haQuantoTempo(iso, agoraISO) {
  const dias = Math.floor((Date.parse(agoraISO) - Date.parse(iso)) / 86400000);
  if (!Number.isFinite(dias) || dias < 0) return '';
  if (dias === 0) return 'hoje';
  if (dias === 1) return 'ontem';
  if (dias < 7) return `há ${dias} dias`;
  const semanas = Math.floor(dias / 7);
  if (semanas < 5) return semanas === 1 ? 'há 1 semana' : `há ${semanas} semanas`;
  const meses = Math.floor(dias / 30);
  if (meses < 12) return meses === 1 ? 'há 1 mês' : `há ${meses} meses`;
  const anos = Math.floor(dias / 365);
  return anos === 1 ? 'há 1 ano' : `há ${anos} anos`;
}

// ── Rumo ao topo do mundo ────────────────────────────────────────────────────
// A seção que o Andre pediu: deixar claro que ele ainda vai rodar o mundo atrás dos melhores
// picos, registrando tudo no YouTube e no Instagram.
//
// CUIDADO COM O TEMPO VERBAL: nada aqui aconteceu. É plano, e o texto tem que dizer isso em
// toda linha ("ainda não", "a lista existe pra isso"). Se algum dia ele for a um destes
// lugares, aí sim vira registro, com vídeo e data. Enquanto não for, não escreva no passado,
// não escreva "conquistando" e não invente patrocínio, convite ou prova marcada.
//
// A ordem é oeste para leste, e é ela que a fila dos marcadores desenha na tela.
export const rumo = {
  rotulo: 'O plano',
  titulo: 'Ainda vou conhecer o mundo todo.',
  texto:
    'A lista abaixo não é currículo: é destino. Nenhum destes picos foi riscado ainda, e é exatamente por isso que eles estão aqui. O combinado é simples: cada viagem que sair, sai com câmera junto, e vira vídeo no canal e story no Instagram.',
  // Sem nota, sem estrela, sem "top 5 do mundo": cada linha é o pico e onde ele fica.
  destinos: [
    { pico: 'Teahupoo', lugar: 'Taiti' },
    { pico: 'Pipeline', lugar: 'Havaí' },
    { pico: 'Nazaré', lugar: 'Portugal' },
    { pico: 'Jeffreys Bay', lugar: 'África do Sul' },
    { pico: 'Uluwatu', lugar: 'Indonésia' },
    { pico: 'Puerto Escondido', lugar: 'México' },
  ],
  legenda: 'Nenhum riscado ainda. É essa a graça.',
  chamada: 'Acompanhar no YouTube',
  chamadaInsta: 'Seguir no Instagram',
};

// ── Parcerias ────────────────────────────────────────────────────────────────
// Sem promessa de resultado para marca, e sem número de seguidores ou alcance: nada disso
// foi informado, e métrica inventada vira promessa que alguém sustenta depois.

export const parcerias = {
  rotulo: 'Parcerias',
  titulo: 'Quer surfar essa junto?',
  texto:
    'Marcas, projetos e convites para provas: fale direto com o Andre pelo WhatsApp ou por e-mail.',
  mensagemWhats: 'Olá! Vim pelo site e quero falar sobre uma parceria com o Andre.',
};

export const redes = [
  { href: INSTAGRAM, label: INSTAGRAM_HANDLE },
  { href: YOUTUBE, label: 'YouTube' },
];
