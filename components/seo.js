// Helper de metadata por página. No App Router, o openGraph da página SUBSTITUI o do layout
// inteiro (não faz merge): declarar na mão perde siteName, locale e type, e sem twitter a
// página herda o card da home. Use sempre este helper.

const OG = { url: '/assets/og.jpg', width: 1200, height: 630, alt: 'Andre Mei surfando uma onda no litoral norte de São Paulo' };

export function pageMeta({ title, description, path }) {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: 'Andre Mei',
      locale: 'pt_BR',
      type: 'website',
      images: [OG],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [OG.url],
    },
  };
}
