"use client";

import { useId, useState } from "react";
import Botao from "@/components/ui/Botao";

const LIMITE = 180;

export default function DescricaoDaVaga({ texto }: { texto: string }) {
  const [aberta, setAberta] = useState(false);
  const idDoTexto = useId();

  const cabeInteira = texto.length <= LIMITE;
  const visivel = aberta || cabeInteira ? texto : texto.slice(0, LIMITE) + "…";

  return (
    <div>
      <p id={idDoTexto}>{visivel}</p>
      {!cabeInteira && (
        <Botao
          variante="secundario"
          aria-expanded={aberta}
          aria-controls={idDoTexto}
          onClick={() => setAberta(!aberta)}
          className="group"
        >
          {aberta ? "ver menos" : "ver mais"}
          <span
            aria-hidden="true"
            className="text-xs motion-safe:transition-transform group-aria-expanded:rotate-180"
          >
            ▼
          </span>
        </Botao>
      )}
    </div>
  );
}
