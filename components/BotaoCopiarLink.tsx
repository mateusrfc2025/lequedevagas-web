"use client";

import { useState } from "react";
import Botao from "@/components/ui/Botao";

export default function BotaoCopiarLink({ titulo }: { titulo: string }) {
  const [copiado, setCopiado] = useState(false);

  return (
    <Botao
      variante="secundario"
      onClick={() => {
        navigator.clipboard.writeText(location.href);
        setCopiado(true);
      }}
    >
      {copiado ? `✓ Link de “${titulo}” copiado` : "🔗 Copiar link"}
    </Botao>
  );
}
