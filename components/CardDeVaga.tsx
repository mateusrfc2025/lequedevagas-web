import Link from "next/link";
import type { Vaga } from "@/lib/tipos";

// Arquivar saiu daqui: ele fica só no painel, para quem publicou a vaga.
export default function CardDeVaga({ vaga }: { vaga: Vaga }) {
  return (
    <li>
      <Link href={`/vagas/${vaga.id}`}>
        {vaga.titulo}
        <span>
          {vaga.empresa} · {vaga.area} · {vaga.senioridade} · {vaga.local}
        </span>
      </Link>
      {vaga.aceitaIniciante && <span className="selo">aceita iniciante</span>}
    </li>
  );
}