import { wa, parcerias } from './content';

// Botão flutuante de WhatsApp, presente em todo site de cliente da Kyber.
// 56px de lado já passa dos 44px de alvo de toque.
export default function WaFab() {
  return (
    <a
      href={wa(parcerias.mensagemWhats, 'fab')}
      target="_blank"
      rel="noopener"
      className="wa-fab"
      aria-label="Falar com o Andre no WhatsApp"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.2-.7.1-.2.3-.7 1-.9 1.2-.2.2-.3.2-.6.1-1.7-.9-2.9-1.6-4-3.6-.3-.5.3-.5.8-1.5.1-.2 0-.4 0-.5 0-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.3 5.2 4.6 1.9.8 2.7.9 3.6.8.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3zM12 2A10 10 0 0 0 3.5 17.2L2 22l4.9-1.5A10 10 0 1 0 12 2z" />
      </svg>
    </a>
  );
}
