"use client";

import { useState } from "react";
import Link from "next/link";
import type { Vaga } from "@/lib/tipos";

export default function AbasDaEmpresa({
  sobre,
  vagas,
}: {
  sobre: string;
  vagas: Vaga[];
}) {
  // O estado aqui é TEXTO, não booleano: "sobre" ou "vagas".
  // Com booleano, a terceira aba (que um dia vem) não caberia.
  const [aba, setAba] = useState("sobre");

  return (
    <div>
      <div className="abas">
        <button
          type="button"
          // A classe é calculada do estado. Isto é estado derivado também:
          // nada de um useState só para guardar "qual botão está aceso".
          className={aba === "sobre" ? "aba ativa" : "aba"}
          onClick={() => setAba("sobre")}
        >
          Sobre
        </button>
        <button
          type="button"
          className={aba === "vagas" ? "aba ativa" : "aba"}
          onClick={() => setAba("vagas")}
        >
          Vagas ({vagas.length})
        </button>
      </div>

      {aba === "sobre" ? (
        <p>{sobre}</p>
      ) : (
        <ul className="lista">
          {vagas.map((vaga) => (
            <li key={vaga.id}>
              <Link href={`/vagas/${vaga.id}`}>{vaga.titulo}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
