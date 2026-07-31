'use client';

import { useEffect } from 'react';

// Revela elementos [data-reveal] ao entrarem na viewport.
// O CSS só esconde esses elementos sob html.js, então sem JavaScript (ou se algo aqui
// falhar) o conteúdo permanece visível. Reveal que falha fechado deixa seção em branco.
export default function Reveal() {
  useEffect(() => {
    const mostrarTudo = () =>
      document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('revealed'));

    try {
      if (!('IntersectionObserver' in window)) {
        mostrarTudo();
        return undefined;
      }
      const io = new IntersectionObserver(
        (entradas) => {
          entradas.forEach((e) => {
            // isIntersecting só é verdade quando o elemento cruza a margem. Rolagem rápida
            // (ou posição restaurada pelo navegador) pode pular esse instante e deixar a
            // seção invisível para sempre, que já aconteceu com o painel de números. Por
            // isso vale também qualquer elemento que já esteja acima da dobra.
            if (e.isIntersecting || e.boundingClientRect.top < window.innerHeight) {
              e.target.classList.add('revealed');
              io.unobserve(e.target);
            }
          });
        },
        { rootMargin: '0px 0px -8% 0px' }
      );
      document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));

      // Rede de segurança: passados 4s, o que ainda estiver escondido aparece. Animação
      // realça, ela nunca pode ser a única coisa que torna o conteúdo visível.
      const rede = setTimeout(mostrarTudo, 4000);

      return () => { io.disconnect(); clearTimeout(rede); };
    } catch {
      mostrarTudo();
      return undefined;
    }
  }, []);

  return null;
}
