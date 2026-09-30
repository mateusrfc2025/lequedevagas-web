import Link from "next/link";
import type { Vaga } from "@/lib/tipos";
import { arquivar } from "@/app/vagas/acoes";
import BotaoDeEnviar from "@/components/BotaoDeEnviar";

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

      <form action={arquivar}>
        <input type="hidden" name="id" value={vaga.id} />
        <BotaoDeEnviar enviando="Arquivando…">Arquivar</BotaoDeEnviar>
      </form>
    </li>
  );
}