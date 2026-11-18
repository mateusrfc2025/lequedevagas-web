"use client";

import { useActionState, useId } from "react";
import BotaoDeEnviar from "./BotaoDeEnviar";
import { enviarCandidatura } from "@/app/vagas/[id]/acoes";
import { EstadoInicial } from "@/lib/tipos";

const LISTA_DE_HABILIDADES = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Python",
  "Node.js",
];

export default function FormularioDeCandidatura({
  vagaId,
  tituloDaVaga,
}: {
  vagaId: string;
  tituloDaVaga: string;
}) {
  const [estado, acaoDoForm] = useActionState(enviarCandidatura, EstadoInicial);
  const idErroHabilidades = useId();

  if (estado.ok) {
    return (
      <div className="ok text-sucesso" role="status">
        <h3>Candidatura registrada ✓</h3>
        <p>
          Recebemos a sua candidatura para <strong>{tituloDaVaga}</strong>.
        </p>
        <button type="button" onClick={() => window.location.reload()}>
          nova candidatura
        </button>
      </div>
    );
  }

  return (
    <form className="formulario" action={acaoDoForm}>
      <input type="hidden" name="vagaId" value={vagaId} />

      <p className="text-suave" style={{ marginBottom: "1rem" }}>
        você se candidata com o nome e o e-mail da sua conta
      </p>

      <fieldset 
        aria-describedby={estado.erros?.habilidades ? idErroHabilidades : undefined}
        style={{ marginBottom: "1rem" }}
      >
        <legend>Habilidades</legend>
        
        <div style={{ display: "grid", gap: "0.5rem", marginTop: "0.5rem" }}>
          {LISTA_DE_HABILIDADES.map((hab) => (
            <label key={hab} style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
              <input type="checkbox" name="habilidades" value={hab} />
              {hab}
            </label>
          ))}
        </div>
      </fieldset>

      {estado.erros?.habilidades && (
        <p id={idErroHabilidades} className="erro">
          {estado.erros.habilidades}
        </p>
      )}

      {estado.erros?.geral && <p className="erro">{estado.erros.geral}</p>}

      <BotaoDeEnviar>Enviar candidatura</BotaoDeEnviar>
    </form>
  );
}