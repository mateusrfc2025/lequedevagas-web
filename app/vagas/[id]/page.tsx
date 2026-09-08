// SEM "use client" — e é a página que usa MAIS componentes de cliente.
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buscarVaga } from "@/lib/api";
import BotaoCopiarLink from "@/components/BotaoCopiarLink";
import DescricaoDaVaga from "@/components/DescricaoDaVaga";
import FormularioDeCandidatura from "@/components/FormularioDeCandidatura";

// Faz o título da aba virar o nome da vaga.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const vaga = await buscarVaga(id);
  return {
    title: vaga ? `${vaga.titulo} · Leque de Vagas` : "Vaga não encontrada",
  };
}

export default async function PaginaDaVaga({
  // 1. a caixinha com os pedaços da URL chega aqui
  params,
}: {
  // Promise = ela chega como um "vale", não pronta
  params: Promise<{ id: string }>;
}) {
  // 2. await troca o vale pelo valor
  const { id } = await params;
  
  const vaga = await buscarVaga(id);

  // 4. não achou? para tudo e mostra o not-found.tsx desta pasta
  if (!vaga) notFound();

  return (
    <article className="vaga">
      {/* Título e ficha vêm prontos do servidor. Não mudam depois. */}
      <h1>{vaga.titulo}</h1>
      <p>
        <Link href={`/empresas/${vaga.empresaSlug}`}>{vaga.empresa}</Link>
        {" · "}
        {vaga.area} · {vaga.senioridade} · {vaga.local}
      </p>

      {vaga.aceitaIniciante && (
        <p className="selo">Aceita quem está começando</p>
      )}

      {/* Daqui para baixo, componentes de cliente lado a lado. Cada um tem a
          própria memória, e nenhum sabe do outro. */}
      <BotaoCopiarLink titulo={vaga.titulo} />
      <DescricaoDaVaga texto={vaga.descricao} />

      <h2>Candidatar-se</h2>
      <FormularioDeCandidatura tituloDaVaga={vaga.titulo} />

      <p>
        <Link href="/vagas">← todas as vagas</Link>
      </p>
    </article>
  );
}
