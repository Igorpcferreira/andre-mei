'use client';

import { useEffect, useRef, useState } from 'react';

// Número que sobe de zero ao valor em 1,6s com desaceleração, quando entra na tela.
//
// O valor final vem do servidor já renderizado (`formatado`), então quem está sem
// JavaScript, com prefers-reduced-motion, ou sem IntersectionObserver, lê o número certo.
// A animação só substitui um texto que já estava correto.
export default function Contador({ valor, formatado }) {
  const ref = useRef(null);
  const [texto, setTexto] = useState(formatado);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    if (!('IntersectionObserver' in window)) return undefined;

    let raf = null;
    const io = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => {
          if (!e.isIntersecting) return;
          io.unobserve(e.target);
          const t0 = performance.now();
          const dur = 1600;
          const passo = (agora) => {
            const k = Math.min(1, (agora - t0) / dur);
            const suave = 1 - Math.pow(1 - k, 3);
            setTexto(Math.round(valor * suave).toLocaleString('pt-BR'));
            if (k < 1) raf = requestAnimationFrame(passo);
            else setTexto(formatado); // fecha exatamente no valor escrito no conteúdo
          };
          raf = requestAnimationFrame(passo);
        });
      },
      { threshold: 0.5 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [valor, formatado]);

  return <span ref={ref}>{texto}</span>;
}
