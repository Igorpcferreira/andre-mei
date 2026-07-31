'use client';

import { useEffect, useRef } from 'react';

// O cursor vira uma prancha que aponta para onde o mouse está indo. Só em ponteiro fino.
//
// O cursor do sistema só some DEPOIS que este aqui confirma que está desenhando (a classe
// entra no <body> no primeiro movimento). Se o script falhasse antes disso, a página ficaria
// sem cursor nenhum. Toque na tela devolve o cursor normal.
export default function CursorPrancha() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    if (!window.matchMedia || !matchMedia('(pointer: fine)').matches) return undefined;

    let ax = -100, ay = -100, x = -100, y = -100;
    let ang = 0, alvoAng = 0, esc = 1, alvoEsc = 1;
    let ligado = false, raf = null;

    const laco = () => {
      raf = requestAnimationFrame(laco);
      x += (ax - x) * 0.25;
      y += (ay - y) * 0.25;
      const d = ((alvoAng - ang + 540) % 360) - 180;
      ang += d * 0.16;
      esc += (alvoEsc - esc) * 0.2;
      el.style.transform =
        `translate(${x - 17}px,${y - 17}px) rotate(${ang}deg) scale(${esc})`;
    };

    const mover = (e) => {
      const dx = e.clientX - ax, dy = e.clientY - ay;
      if (Math.hypot(dx, dy) > 3) alvoAng = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
      ax = e.clientX;
      ay = e.clientY;
      alvoEsc = e.target && e.target.closest && e.target.closest('a,button') ? 1.6 : 1;
      if (!ligado) {
        ligado = true;
        x = ax; y = ay;
        el.style.display = 'block';
        document.body.classList.add('cursor-proprio');
        laco();
      }
    };

    // Teclado e touch devolvem o cursor do sistema: quem não está usando o mouse não pode
    // ficar sem ponteiro nenhum.
    const desligar = () => {
      document.body.classList.remove('cursor-proprio');
      el.style.display = 'none';
      if (raf) cancelAnimationFrame(raf);
      raf = null;
      ligado = false;
    };

    document.addEventListener('mousemove', mover, { passive: true });
    document.addEventListener('touchstart', desligar, { passive: true });

    return () => {
      document.removeEventListener('mousemove', mover);
      document.removeEventListener('touchstart', desligar);
      if (raf) cancelAnimationFrame(raf);
      document.body.classList.remove('cursor-proprio');
    };
  }, []);

  return (
    <div className="cursor" ref={ref} aria-hidden="true">
      <svg
        width="34"
        height="34"
        viewBox="0 0 34 34"
        style={{ display: 'block', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,.35))' }}
      >
        <path
          d="M17 1.5 C23 8 25.5 18 17 32.5 C8.5 18 11 8 17 1.5 Z"
          fill="#F3EEE2"
          stroke="#07332C"
          strokeWidth="1.4"
        />
        <line x1="17" y1="5" x2="17" y2="29" stroke="#DE8A3F" strokeWidth="2" />
      </svg>
    </div>
  );
}
