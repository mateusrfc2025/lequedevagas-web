// FRENTE 1 · sem estado e SEM "use client". Ele só desenha o que recebe.
import Link from "next/link";
import type { Vaga } from "@/lib/tipos";

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
