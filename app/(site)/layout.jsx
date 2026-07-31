import Footer from '../../components/Footer';
import WaFab from '../../components/WaFab';
import Reveal from '../../components/Reveal';
import CursorPrancha from '../../components/CursorPrancha';

// O chrome do site. O hero traz o próprio cabeçalho (ele fica por cima da foto), então aqui
// não há Header: o que envolve todas as páginas é o main, o rodapé e os dois flutuantes.
export default function SiteLayout({ children }) {
  return (
    <>
      <a className="pular" href="#conteudo">
        Pular para o conteúdo
      </a>

      {/* tabIndex -1 faz o skip-link mover o foco E a tela. Sem ele o navegador só troca o
          foco e a página não sai do lugar, que é o mesmo que o atalho não funcionar. */}
      <main id="conteudo" tabIndex={-1}>
        {children}
      </main>

      <Footer />
      <WaFab />
      <Reveal />
      <CursorPrancha />
    </>
  );
}
