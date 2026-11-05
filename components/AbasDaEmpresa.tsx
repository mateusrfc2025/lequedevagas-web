"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import type { Empresa, Vaga } from "@/lib/tipos";

const ABAS = ["sobre", "vagas"] as const;
type Aba = (typeof ABAS)[number];

export default function AbasDaEmpresa({
  empresa,
  vagas,
}: {
  empresa: Empresa;
  vagas: Vaga[];
}) {
  const [aba, setAba] = useState<Aba>("sobre");
  const id = useId();
  const botoes = useRef<Record<Aba, HTMLButtonElement | null>>({ sobre: null, vagas: null });
  const rotulos: Record<Aba, string> = { sobre: "Sobre", vagas: `Vagas (${vagas.length})` };

  function aoTeclar(evento: KeyboardEvent) {
    if (evento.key !== "ArrowRight" && evento.key !== "ArrowLeft") return;
    evento.preventDefault();
    const passo = evento.key === "ArrowRight" ? 1 : -1;
    const proxima = ABAS[(ABAS.indexOf(aba) + passo + ABAS.length) % ABAS.length];
    setAba(proxima);
    botoes.current[proxima]?.focus();
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label={`Sobre a ${empresa.nome}`}
        className="my-4 flex gap-2"
        onKeyDown={aoTeclar}
      >
        {ABAS.map((nome) => (
          <button
            key={nome}
            ref={(botao) => {
              botoes.current[nome] = botao;
            }}
            type="button"
            role="tab"
            id={`${id}-${nome}`}
            aria-selected={aba === nome}
            aria-controls={`${id}-painel`}
            tabIndex={aba === nome ? 0 : -1}
            onClick={() => setAba(nome)}
            className="rounded-lg border border-borda px-3.5 py-2 text-suave aria-selected:border-principal aria-selected:font-semibold aria-selected:text-principal"
          >
            {rotulos[nome]}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`${id}-painel`} aria-labelledby={`${id}-${aba}`} tabIndex={0}>
        {aba === "sobre" ? (
          <>
            <p>{empresa.sobre}</p>
            <p>
              <a href={empresa.site} target="_blank" rel="noopener noreferrer">
                {empresa.site}
              </a>
            </p>
          </>
        ) : vagas.length === 0 ? (
          <p>Esta empresa não tem vaga aberta agora.</p>
        ) : (
          <ul className="grid gap-2">
            {vagas.map((vaga) => (
              <li key={vaga.id}>
                <Link href={`/vagas/${vaga.id}`}>{vaga.titulo}</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
