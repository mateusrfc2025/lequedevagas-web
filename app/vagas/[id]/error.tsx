"use client"; // obrigatório: telas de erro rodam no navegador

/* A prop de recomeçar chama `retry` no Next 16 — era `reset` nas versões
   anteriores, e o nome antigo não existe mais. Se você viu `reset` em algum
   tutorial, era de uma versão que não é a nossa. */
export default function ErroDaVaga({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="aviso">
      <h2>Não foi possível carregar esta vaga</h2>
      <p>Pode ter tido alguma instabilidade. Tente de novo por favor.</p>
      <button type="button" onClick={() => reset()}>
        Tentar de novo
      </button>
    </div>
  );
}
