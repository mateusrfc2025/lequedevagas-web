"use client"; // obrigatório: telas de erro rodam no navegador

/* A prop de recomeçar chama `retry` no Next 16 — era `reset` nas versões
   anteriores, e o nome antigo não existe mais. Se você viu `reset` em algum
   tutorial, era de uma versão que não é a nossa. */
export default function ErroDaVaga({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <div className="aviso">
      <h2>Não consegui carregar esta vaga</h2>
      <p>Pode ter sido instabilidade. Tente de novo.</p>
      <p className="tecnico">{error.digest ?? error.message}</p>
      <button type="button" onClick={() => retry()}>
        Tentar de novo
      </button>
    </div>
  );
}
