"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import BotaoDeEnviar from "./BotaoDeEnviar";
import { enviarCandidatura } from "../lib/formulario";

export default function FormularioDeCandidatura({
  tituloDaVaga,
}: {
  tituloDaVaga: string;
}) {
  // Cinco memórias. Cada uma guarda uma coisa que o servidor não tem como
  // saber: o que a pessoa digitou nesta aba, agora.
  const [rascunho, setRascunho] = useState("");
  const [habilidades, setHabilidades] = useState<string[]>([]);
  const [estado, dispatch] = useFormState(enviarCandidatura, null);

  
  function adicionar() {
    const nova = rascunho.trim();
    // vazio ou repetido: não faz nada, e não some com o que a pessoa digitou
    if (nova === "" || habilidades.includes(nova)) return;
    setHabilidades([...habilidades, nova]); // lista NOVA, não push
    setRascunho("");

    
  }

  // Duas telas no mesmo arquivo. O "enviada" decide qual delas aparece.
  if (estado?.ok) {
    return (
      <div className="ok">
        <h3>Candidatura registrada ✓</h3>
        <p>
          {estado.nome}, guardamos a sua candidatura para{" "}
          <strong>{tituloDaVaga}</strong> com {habilidades.length}{" "}
          habilidade(s).
        </p>
        {/* Voltar é desligar este estado: os outros quatro continuam lá. */}
        <button type="button" onClick={() => window.location.reload()}>
          nova candidatura
        </button>
      </div>
    );
  }

  return (
    <form className="formulario" action={dispatch}>
      <label>
        Nome
        {/* value + onChange andam JUNTOS. Só o value prende o campo. */}
        <input name ="nome" type="text" />
      </label>

      <label>
        E-mail
        <input name="email" type="email"/>
      </label>

      <label>
        Habilidades
        <input
          value={rascunho}
          onChange={(e) => setRascunho(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              // dentro de um form, Enter envia. Aqui ele adiciona.
              e.preventDefault();
              adicionar();
            }
          }}
        />
      </label>
      <button type="button" onClick={adicionar}>
        adicionar
      </button>

      <ul className="chips">
        {habilidades.map((h) => (
          <li key={h}>
            {h}
            <button
              type="button"
              aria-label={`remover ${h}`}
              // filter também devolve lista NOVA. É o mesmo princípio.
              onClick={() =>
                setHabilidades(habilidades.filter((x) => x !== h))
              }
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      {habilidades.map((h) => (
        <input key={h} type="hidden" name="habilidades" value={h} />
      ))}

      <BotaoDeEnviar> enviar candidatura </BotaoDeEnviar>
    </form>
  );
}
