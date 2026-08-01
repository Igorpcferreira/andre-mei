import localFont from 'next/font/local';
import './globals.css';
import { SITE_URL, NOME, RESUMO, idadeEm } from '../components/content';

// Fontes self-hospedadas: nenhuma requisição a terceiro. Os woff2 estão commitados em
// app/fonts/, e cada família traz os subconjuntos latin e latin-ext, que é o que o
// português usa. Nada de Google Fonts por CDN.
const anton = localFont({
  src: [
    { path: './fonts/anton-400.woff2', weight: '400', style: 'normal' },
    { path: './fonts/anton-400-ext.woff2', weight: '400', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-display',
  fallback: ['Impact', 'Arial Narrow', 'sans-serif'],
});

const archivo = localFont({
  src: [
    { path: './fonts/archivo-var.woff2', weight: '400 900', style: 'normal' },
    { path: './fonts/archivo-var-ext.woff2', weight: '400 900', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-body',
  fallback: ['system-ui', 'sans-serif'],
});

// A idade sai da data de nascimento, carimbada no build (mesmo motivo do HOJE da página:
// export estático não pode calcular data em tempo de execução). Não escreva o número na mão.
const IDADE = idadeEm(new Date().toISOString().slice(0, 10));

const TITULO = `${NOME} · ${RESUMO}`;
const DESCRICAO =
  `Andre Mei, ${IDADE} anos, vive no litoral norte de São Paulo entre o surfe e a trilha. Surfista, ultramaratonista e Guinness Book. Parcerias pelo WhatsApp.`;
const DESCRICAO_CURTA =
  `${IDADE} anos, litoral norte de São Paulo. Entre o mar e a trilha, rumo ao topo do mundo.`;
const OG = {
  url: '/assets/og.jpg',
  width: 1200,
  height: 630,
  alt: 'Andre Mei surfando uma onda no litoral norte de São Paulo',
};

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITULO,
  description: DESCRICAO,
  alternates: { canonical: '/' },
  // Liberado em 01/08, quando o andremei.com.br entrou no ar. Antes disso o site ficou com
  // noindex de propósito, porque o endereço era provisório da Vercel.
  robots: { index: true, follow: true },
  openGraph: {
    title: TITULO,
    description: DESCRICAO_CURTA,
    url: '/',
    siteName: NOME,
    locale: 'pt_BR',
    type: 'website',
    images: [OG],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITULO,
    description: DESCRICAO_CURTA,
    images: [OG.url],
  },
};

export const viewport = {
  themeColor: '#07332C',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${anton.variable} ${archivo.variable}`}>
      <body>
        {/* Liga a classe .js: os estados iniciais escondidos do reveal só existem com
            JavaScript ativo. Sem script, todo o conteúdo aparece normalmente. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js');",
          }}
        />
        {children}
      </body>
    </html>
  );
}
