"use client"; // obrigatório: telas de erro rodam no navegador

export default function ErroDasVagas({
  reset,
  retry,
}: {
  error: Error & { digest?: string };
  reset?: () => void;
  retry?: () => void;
}) {
  return (
    <div className="aviso">
      <h2>Não foi possível carregar as vagas</h2>
      <p>O servidor de vagas está instável. Tente de novo em instantes.</p>
      <button type="button" onClick={() => (retry ?? reset)?.()}>
        Tentar de novo
      </button>
    </div>
  );
}