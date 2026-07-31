import { SITE_URL } from '../components/content';

// Data de revisão do conteúdo, atualizada na mão a cada mudança relevante.
// Não usar new Date(): carimbar a data do deploy em todas as URLs a cada build ensina o
// Google a ignorar o sinal de lastModified.
const REVISADO_EM = '2026-07-31';

export default function sitemap() {
  return [{ url: `${SITE_URL}/`, lastModified: REVISADO_EM }];
}
