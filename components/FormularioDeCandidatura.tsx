"use client";

import { useState, useActionState } from "react";
import BotaoDeEnviar from "./BotaoDeEnviar";
import { enviarCandidatura } from "@/app/vagas/[id]/acoes";
import { EstadoInicial } from "@/lib/tipos";

export default function FormularioDeCandidatura({
  vagaId,
  tituloDaVaga,
}: {
  vagaId: string;
  tituloDaVaga: string;
}) {
  const [rascunho, setRascunho] = useState("");
  const [habilidades, setHabilidades] = useState<string[]>([]);
  const [estado, acaoDoForm] = useActionState(enviarCandidatura, EstadoInicial);

  function adicionar() {
    const nova = rascunho.trim();
    if (nova === "" || habilidades.includes(nova)) return;
    setHabilidades([...habilidades, nova]);
    setRascunho("");
  }

  if (estado.ok) {
    return (
      <div className="ok" role="status">
        <h3>Candidatura registrada ✓</h3>
        <p>
          Recebemos a sua candidatura para <strong>{tituloDaVaga}</strong>. Ela aparece na sua área.
        </p>
      </div>
    );
  }

  return (
    <form className="formulario" action={acaoDoForm}>
      <input type="hidden" name="vagaId" value={vagaId} />

      {/* SEM name: este campo é só o rascunho, não deve ser enviado */}
      <label>
        Habilidades
        <input
          value={rascunho}
          onChange={(e) => setRascunho(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              adicionar();
            }
          }}
        />
      </label>
      <button type="button" onClick={adicionar}>
        adicionar
      </button>
      {estado.erros?.habilidades && <p className="erro">{estado.erros.habilidades}</p>}

      <ul className="chips">
        {habilidades.map((h) => (
          <li key={h}>
            {h}
            <button
              type="button"
              aria-label={`remover ${h}`}
              onClick={() => setHabilidades(habilidades.filter((x) => x !== h))}
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      {/* As habilidades viajam nestes campos escondidos (mesmo name) */}
      {habilidades.map((h) => (
        <input key={h} type="hidden" name="habilidades" value={h} />
      ))}

      {/* candidatura repetida: a API manda o erro no campo email */}
      {estado.erros?.email && <p className="erro">{estado.erros.email}</p>}
      {estado.mensagem && (
        <p className="erro" role="alert">
          {estado.mensagem}
        </p>
      )}

      <BotaoDeEnviar>Enviar candidatura</BotaoDeEnviar>
    </form>
  );
}