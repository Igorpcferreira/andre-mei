import AguaHero from '../../components/AguaHero';
import Contador from '../../components/Contador';
import JsonLd from '../../components/JsonLd';
import VideoDestaque from '../../components/VideoDestaque';
import {
  SITE_URL, NOME, EMAIL, WHATSAPP_NUMBER, INSTAGRAM, INSTAGRAM_SURF, INSTAGRAM_SURF_HANDLE,
  YOUTUBE, chips, chipDestaque, letreiro, falaAndre, sobre, ultra, heroFoto, sobreFoto,
  galeria, parcerias, srcSet, src, wa,
  youtube, videoDestaque, videosPrevia, haQuantoTempo,
} from '../../components/content';

// Data de referência do "há quanto tempo", carimbada no build. Precisa ser um valor fixo, e
// não `new Date()` dentro do componente: o site é export estático, então o HTML é gerado uma
// vez e o texto tem que ser o mesmo no servidor e no navegador, senão o React acusa erro de
// hidratação. Fica desatualizado entre um deploy e outro, e tudo bem: a data exata do vídeo
// está no <time dateTime>, que é o que máquina lê.
const HOJE = new Date().toISOString().slice(0, 10);

const pessoa = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: NOME,
  alternateName: 'Andremeii',
  description: 'Surfista e ultramaratonista de 17 anos, do litoral norte de São Paulo.',
  image: `${SITE_URL}/assets/og.jpg`,
  url: `${SITE_URL}/`,
  email: EMAIL,
  telephone: `+${WHATSAPP_NUMBER}`,
  homeLocation: {
    '@type': 'Place',
    address: { '@type': 'PostalAddress', addressRegion: 'SP', addressCountry: 'BR' },
  },
  sameAs: [INSTAGRAM, INSTAGRAM_SURF, YOUTUBE],
};

// VideoObject do vídeo em destaque. Só campos que vêm do feed: nada de duração, contagem de
// visualizações ou transcrição, que o feed não dá e que inventados seriam dado falso no
// resultado de busca. A thumbnail é a URL do YouTube (absoluta e estável) porque a capa
// local só existe depois do deploy, e o Google precisa de uma que resolva de fora.
const videoSchema = {
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: videoDestaque.titulo,
  uploadDate: videoDestaque.publicado,
  thumbnailUrl: `https://i.ytimg.com/vi/${videoDestaque.id}/hqdefault.jpg`,
  contentUrl: videoDestaque.url,
  embedUrl: `https://www.youtube-nocookie.com/embed/${videoDestaque.id}`,
  author: { '@type': 'Person', name: NOME, url: `${SITE_URL}/` },
};

// O letreiro roda duas cópias lado a lado e a animação desloca 50%: por isso a lista é
// repetida, senão aparece um vão quando a fita reinicia.
const fita = `${letreiro.join(' · ')} · ${letreiro.join(' · ')} · `;

export default function Home() {
  return (
    <>
      <JsonLd data={pessoa} />
      <JsonLd data={videoSchema} />

      <div className="hero">
        {/* Imagem principal: eager e fetchPriority alto, é o LCP da página. O canvas do
            WebGL desenha por cima dela; se o WebGL não subir, esta foto continua sendo o
            hero e ninguém percebe falta. Sem data-reveal (piora o LCP). */}
        <img
          id="hero-foto"
          className="hero-foto"
          src={src(heroFoto)}
          srcSet={srcSet(heroFoto)}
          sizes="100vw"
          width={heroFoto.width}
          height={heroFoto.height}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          alt={heroFoto.alt}
        />
        <AguaHero />
        <div className="hero-veu" />

        <header className="hero-topo">
          <span className="marca">{NOME}</span>
          <nav className="hero-nav" aria-label="Atalhos">
            <a className="so-desktop" href={INSTAGRAM} target="_blank" rel="noopener">
              Instagram
            </a>
            <a className="so-desktop" href={YOUTUBE} target="_blank" rel="noopener">
              YouTube
            </a>
            <a className="bt bt-sol" href="#parcerias">
              Parcerias
            </a>
          </nav>
        </header>

        <div className="hero-base">
          <h1>{NOME}</h1>
          <div className="chips">
            {chips.map((c) => (
              <span className="chip" key={c}>{c}</span>
            ))}
            <span className="chip chip-sol">{chipDestaque}</span>
          </div>
          {/* Só aparece quando a água liga de verdade: o AguaHero tira o hidden. */}
          <p className="dica" id="dica-agua" hidden>
            <span className="seta" aria-hidden="true">▾</span>
            <span>Passe o dedo na água. Ela responde.</span>
          </p>
        </div>
      </div>

      <div className="letreiro" aria-hidden="true">
        <div className="letreiro-fita">
          <span>{fita}</span>
          <span>{fita}</span>
        </div>
      </div>

      <section className="quem claro">
        <div className="quem-fundo" aria-hidden="true">Insólito</div>
        <div className="limite quem-grade">
          <img
            className="quem-foto"
            src={src(sobreFoto)}
            srcSet={srcSet(sobreFoto)}
            sizes="(min-width: 860px) 50vw, 100vw"
            width={sobreFoto.width}
            height={sobreFoto.height}
            loading="lazy"
            decoding="async"
            alt={sobreFoto.alt}
            data-reveal
          />
          <div className="quem-texto">
            <p className="rotulo">Quem é o André</p>
            <blockquote className="quem-fala">&quot;{falaAndre}&quot;</blockquote>
            <p className="corpo">{sobre}</p>
            <div className="quem-acoes">
              <a className="bt bt-mar" href={YOUTUBE} target="_blank" rel="noopener">
                Ver o canal no YouTube
              </a>
              <a className="bt bt-contorno" href={INSTAGRAM_SURF} target="_blank" rel="noopener">
                {INSTAGRAM_SURF_HANDLE}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="ultra escuro">
        <div className="limite">
          <p className="rotulo">{ultra.rotulo}</p>
          <h2>{ultra.titulo}</h2>
          <p className="corpo">{ultra.texto}</p>

          <div className="numeros" data-reveal>
            {ultra.numeros.map((n) => (
              <div className="numero" key={n.rotulo}>
                <p className="numero-valor">
                  {n.contador ? (
                    <Contador valor={n.contador} formatado={n.valor} />
                  ) : (
                    n.valor
                  )}
                  {n.unidade.startsWith(':') ? null : ' '}
                  <span className="un">{n.unidade}</span>
                </p>
                <p className="numero-rotulo">{n.rotulo}</p>
              </div>
            ))}
          </div>

          <div className="prova">
            <figure>
              <img
                src={ultra.evidencia.src}
                width={ultra.evidencia.width}
                height={ultra.evidencia.height}
                loading="lazy"
                decoding="async"
                alt={ultra.evidencia.alt}
              />
              <figcaption>{ultra.evidencia.legenda}</figcaption>
            </figure>
            <p className="prova-nota">{ultra.nota}</p>
          </div>
        </div>
      </section>

      <section className="galeria">
        <div className="galeria-topo">
          <h2>Na água</h2>
          <p className="galeria-dica">Arraste para o lado</p>
        </div>
        {/* Rolagem horizontal também pelo teclado: sem tabindex, quem navega por teclado
            não alcança as fotos do meio. */}
        <div
          className="galeria-fita"
          tabIndex={0}
          role="group"
          aria-label="Fotos do André surfando, role para o lado"
        >
          {galeria.map((f) => (
            <img
              key={f.base}
              src={src(f)}
              srcSet={srcSet(f)}
              sizes="(min-width: 760px) 58vh, 52vh"
              width={f.width}
              height={f.height}
              loading="lazy"
              decoding="async"
              alt={f.alt}
            />
          ))}
        </div>
      </section>

      <section className="canal">
        <div className="limite canal-topo">
          <div className="canal-cabeca">
            <div>
              <p className="rotulo">{youtube.rotulo}</p>
              <h2 style={{ marginTop: '14px' }}>{youtube.titulo}</h2>
            </div>
            <a className="bt bt-sol" href={YOUTUBE} target="_blank" rel="noopener">
              {youtube.chamada}
            </a>
          </div>
          <p className="corpo">{youtube.texto}</p>

          <div data-reveal>
            <VideoDestaque video={videoDestaque} />
            <p className="video-titulo">{videoDestaque.titulo}</p>
            <p className="video-data">
              Último vídeo ·{' '}
              <time dateTime={videoDestaque.publicado}>
                {haQuantoTempo(videoDestaque.publicado, HOJE)}
              </time>
            </p>
          </div>

          <div className="canal-previas">
            {videosPrevia.map((v) => (
              <article className="previa-item" key={v.id}>
                {/* A capa não é link: quem clica é o título, que se estica por cima do card
                    inteiro (ver .previa-titulo::after). Assim há um alvo só por vídeo, com
                    tamanho de cartão, em vez de dois links seguidos para o mesmo destino. */}
                <div className="previa-capa">
                  <img
                    src={v.capa}
                    width={v.capaLargura}
                    height={v.capaAltura}
                    loading="lazy"
                    decoding="async"
                    alt=""
                  />
                  <span className="video-play" aria-hidden="true">
                    <svg viewBox="0 0 68 48" focusable="false">
                      <path
                        className="video-play-fundo"
                        d="M66.5 7.7c-.8-2.9-2.5-5.4-5.4-6.2C55.8.1 34 0 34 0S12.2.1 6.9 1.5C4 2.3 2.3 4.8 1.5 7.7 0 13 0 24 0 24s0 11 1.5 16.3c.8 2.9 2.5 5.4 5.4 6.2C12.2 47.9 34 48 34 48s21.8-.1 27.1-1.5c2.9-.8 4.6-3.3 5.4-6.2C68 35 68 24 68 24s0-11-1.5-16.3z"
                      />
                      <path d="M45 24 27 14v20" fill="#fff" />
                    </svg>
                  </span>
                </div>
                <a className="previa-titulo" href={v.url} target="_blank" rel="noopener">
                  {v.titulo}
                </a>
                <p className="previa-data">
                  <time dateTime={v.publicado}>{haQuantoTempo(v.publicado, HOJE)}</time>
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="parcerias" className="parcerias claro">
        <div className="limite">
          <p className="rotulo">{parcerias.rotulo}</p>
          <h2>{parcerias.titulo}</h2>
          <p className="corpo">{parcerias.texto}</p>
          <div className="parcerias-acoes">
            <a
              className="bt bt-sol bt-grande"
              href={wa(parcerias.mensagemWhats, 'parcerias')}
              target="_blank"
              rel="noopener"
            >
              Chamar no WhatsApp
            </a>
            <a className="bt bt-contorno bt-grande bt-email" href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
