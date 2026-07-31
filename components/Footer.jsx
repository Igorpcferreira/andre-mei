import { NOME, LOCAL, redes } from './content';

export default function Footer() {
  return (
    <footer>
      <span className="marca">{NOME}</span>

      <nav className="rodape-redes" aria-label="Redes sociais">
        {redes.map((r) => (
          <a key={r.href} href={r.href} target="_blank" rel="noopener">
            {r.label}
          </a>
        ))}
      </nav>

      <span className="rodape-lugar">{LOCAL}</span>

      {/* Selo da Kyber Tech: obrigatório em todo site de cliente, não remova.
          O ?origem= é o que separa a visita vinda daqui do tráfego direto. */}
      <p className="selo-kyber">
        <a
          href="https://somoskyber.com.br/?origem=selo-andre-mei"
          target="_blank"
          rel="noopener noreferrer"
        >
          Desenvolvido por Kyber Tech
        </a>
      </p>
    </footer>
  );
}
