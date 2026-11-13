"use client"; // obrigatório: telas de erro rodam no navegador

/* O curso diz que no Next 16 a função se chama `retry`; versões anteriores
   usavam `reset`. Aceitando as duas, o botão funciona em qualquer caso. */
export default function ErroDaVaga({
  retry,
  reset,
}: {
  error: Error & { digest?: string };
  retry?: () => void;
  reset?: () => void;
}) {
  return (
    <div className="aviso">
      <h2>Não foi possível carregar esta vaga</h2>
      <p>Pode ter tido alguma instabilidade. Tente de novo por favor.</p>
      <button type="button" onClick={() => (retry ?? reset)?.()}>
        Tentar de novo
      </button>
    </div>
  );
}