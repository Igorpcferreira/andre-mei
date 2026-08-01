import Link from 'next/link';

export const metadata = {
  title: 'Página não encontrada · Andre Mei',
  robots: { index: false, follow: false },
};

export default function NaoEncontrada() {
  return (
    <main
      id="conteudo"
      style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '22px',
        textAlign: 'center',
        padding: '90px 28px',
        background: 'var(--mar)',
        color: 'var(--espuma)',
      }}
    >
      <p className="rotulo">Erro 404</p>
      <h1 style={{ fontSize: 'clamp(40px, 9vw, 90px)' }}>Essa onda passou</h1>
      <p className="corpo" style={{ color: 'var(--espuma-78)' }}>
        A página que você procurou não existe (ou mudou de lugar).
      </p>
      <Link className="bt bt-sol" href="/">
        Voltar para o início
      </Link>
    </main>
  );
}
