// Lê o feed público do canal do André e grava components/videos.json, mais as capas em
// public/assets/yt/.
//
//   npm run videos      (instala o sharp sem salvar, busca o feed, converte as capas)
//
// NÃO roda sozinho no build, de propósito. O resultado (o JSON e os .webp) é commitado, e é
// isso que a Vercel publica. Se rodasse no build da Vercel, o sharp não estaria lá e as
// capas cairiam de volta para o i.ytimg.com, reintroduzindo requisição a terceiro sem
// ninguém perceber.
//
// Para o site acompanhar o canal sozinho: Vercel > Settings > Cron Jobs não serve (ele
// chama URL, não rebuilda). O caminho é um workflow agendado no GitHub que roda este script,
// comita o que mudou e deixa o push disparar o deploy. Enquanto isso não existir, rode
// `npm run videos` quando o André publicar vídeo novo, e comite.
//
// Por que o feed RSS e não a API do YouTube: o feed é público, não pede chave, não tem cota
// e devolve os 15 vídeos mais recentes, que é bem mais do que a seção usa. Chave de API
// seria mais um segredo para guardar e mais uma coisa para expirar calado.
//
// Por que gravar em arquivo em vez de buscar no navegador: o site é export estático e o
// feed do YouTube não libera CORS. Buscar do lado do cliente exigiria um proxy, que é mais
// uma peça para manter e quebrar. Aqui o build congela os dados no HTML, o que também faz
// o vídeo aparecer para quem bloqueia o YouTube.

import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));
const SAIDA = join(AQUI, '..', 'components', 'videos.json');
const CAPAS = join(AQUI, '..', 'public', 'assets', 'yt');

const CANAL = 'UC109LgXZ9ThI0BNtslQgAiQ'; // @andremeii
const FEED = `https://www.youtube.com/feeds/videos.xml?channel_id=${CANAL}`;
const QUANTOS = 5; // 1 em destaque + 4 prévias

const um = (texto, re) => (texto.match(re) ?? [])[1] ?? '';

// O título vem cru do YouTube: entidade XML escapada e, às vezes, travessão. O travessão é
// proibido em qualquer lugar visível do site (regra nº 1 da casa), então vira ponto mediano.
// Emoji fica: quem usou primeiro foi o próprio André, no título dele.
function limparTitulo(bruto) {
  return bruto
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s*[—–]\s*/g, ' · ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function buscar() {
  const resp = await fetch(FEED, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; KyberTech/1.0)' },
    signal: AbortSignal.timeout(20000),
  });
  if (!resp.ok) throw new Error(`feed respondeu ${resp.status}`);
  const xml = await resp.text();

  const entradas = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)];
  if (!entradas.length) throw new Error('feed veio sem nenhum <entry>');

  return entradas.slice(0, QUANTOS).map(([, bloco]) => {
    const id = um(bloco, /<yt:videoId>([^<]*)<\/yt:videoId>/);
    if (!id) throw new Error('entrada do feed sem videoId');
    return {
      id,
      titulo: limparTitulo(um(bloco, /<title>([^<]*)<\/title>/)),
      publicado: um(bloco, /<published>([^<]*)<\/published>/).slice(0, 10),
      url: `https://www.youtube.com/watch?v=${id}`,
    };
  });
}

// As capas são baixadas e convertidas para webp local, em vez de apontar para o
// i.ytimg.com. Assim o site não faz requisição a terceiro só para desenhar a seção (o
// Google saberia quem visitou a página antes de a pessoa decidir assistir), e a capa entra
// no mesmo cache das outras imagens.
async function baixarCapas(videos) {
  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch {
    console.error('! sharp não encontrado: as capas ficam apontando para o i.ytimg.com.');
    console.error('  rode `npm i --no-save sharp` e este script de novo para hospedar local.');
    return videos.map((v) => ({
      ...v,
      capa: `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
      capaLargura: 480,
      capaAltura: 360,
    }));
  }

  mkdirSync(CAPAS, { recursive: true });
  const saida = [];
  for (const v of videos) {
    // maxresdefault é 1280x720 mas não existe em todo vídeo; hqdefault existe sempre, com
    // 480x360 e tarjas pretas em cima e embaixo (o quadro real é 480x270, 16:9).
    const tentativas = [
      { url: `https://i.ytimg.com/vi/${v.id}/maxresdefault.jpg`, cortar: false },
      { url: `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`, cortar: true },
    ];
    let feito = null;
    for (const t of tentativas) {
      try {
        const r = await fetch(t.url, { signal: AbortSignal.timeout(20000) });
        if (!r.ok) continue;
        let img = sharp(Buffer.from(await r.arrayBuffer()));
        // hqdefault vem com tarja: recorta o miolo 16:9 antes de salvar.
        if (t.cortar) img = img.extract({ left: 0, top: 45, width: 480, height: 270 });
        const arq = join(CAPAS, `${v.id}.webp`);
        const info = await img.resize({ width: 960, withoutEnlargement: true })
          .webp({ quality: 78, effort: 6 }).toFile(arq);
        feito = { capa: `/assets/yt/${v.id}.webp`, capaLargura: info.width, capaAltura: info.height };
        console.log(`    capa ${v.id}: ${info.width}x${info.height}, ${Math.round(info.size / 1024)} KB`);
        break;
      } catch { /* tenta o próximo tamanho */ }
    }
    saida.push(feito ? { ...v, ...feito } : {
      ...v,
      capa: `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
      capaLargura: 480,
      capaAltura: 360,
    });
  }
  return saida;
}

try {
  const crus = await buscar();
  const videos = await baixarCapas(crus);
  mkdirSync(dirname(SAIDA), { recursive: true });
  writeFileSync(SAIDA, `${JSON.stringify({ canal: CANAL, videos }, null, 2)}\n`);
  console.log(`✓ ${videos.length} vídeos gravados em components/videos.json`);
  videos.forEach((v, i) => console.log(`  ${i + 1}. ${v.titulo} (${v.publicado})`));
} catch (erro) {
  // Falha de rede não pode derrubar o build: se já existe um videos.json de uma execução
  // anterior, o site sobe com a lista de antes (desatualizada, mas correta). Só o primeiro
  // build da vida, sem arquivo nenhum, é que para de verdade.
  console.error(`! não deu para ler o feed do YouTube: ${erro.message}`);
  if (existsSync(SAIDA)) {
    const antigo = JSON.parse(readFileSync(SAIDA, 'utf8'));
    console.error(`  seguindo com o videos.json que já existia (${antigo.videos.length} vídeos).`);
    console.error('  a seção do YouTube vai ao ar desatualizada: rode de novo quando a rede voltar.');
  } else {
    console.error('  e não existe videos.json anterior para usar. Build interrompido.');
    process.exit(1);
  }
}
