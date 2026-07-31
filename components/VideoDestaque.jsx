'use client';

import { useState } from 'react';

// Capa que vira player no clique. O iframe do YouTube só entra no DOM depois que a pessoa
// aperta o play: antes disso a seção não custa os ~700 KB de script do Google, e nenhum
// cookie de rastreio é gravado em quem só passou pelo site (o que também resolve a LGPD sem
// precisar de banner de consentimento).
//
// O link para o YouTube existe no HTML desde o começo: sem JavaScript, o clique leva ao
// vídeo lá, que é o destino desejado de qualquer jeito.
export default function VideoDestaque({ video }) {
  const [tocando, setTocando] = useState(false);

  if (tocando) {
    return (
      <div className="video-quadro">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
          title={video.titulo}
          allow="accelerated-download; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="video-quadro">
      <a
        className="video-capa"
        href={video.url}
        target="_blank"
        rel="noopener"
        onClick={(e) => {
          // Ctrl/Cmd/meio: deixa o navegador abrir em outra aba, como o visitante pediu.
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
          e.preventDefault();
          setTocando(true);
        }}
        aria-label={`Assistir: ${video.titulo}`}
      >
        <img
          src={video.capa}
          width={video.capaLargura}
          height={video.capaAltura}
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
      </a>
    </div>
  );
}
