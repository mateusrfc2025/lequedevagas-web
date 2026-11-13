import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buscarVaga, contarCandidaturas, listarVagas } from "@/lib/api";
import DescricaoDaVaga from "@/components/DescricaoDaVaga";
import BotaoCopiarLink from "@/components/BotaoCopiarLink";
import FormularioDeCandidatura from "@/components/FormularioDeCandidatura";

type VagaPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: VagaPageProps): Promise<Metadata> {
  const { id } = await params;
  const vaga = await buscarVaga(id);
  return {
    title: vaga ? `${vaga.titulo} - Leque de Vagas` : "Vaga não encontrada",
  };
}

export async function generateStaticParams() {
  const vagas = await listarVagas();
  return vagas.map((vaga) => ({ id: String(vaga.id) }));
}

export default async function VagaPage({ params }: VagaPageProps) {
  const { id } = await params;
  const vaga = await buscarVaga(id);
  if (!vaga) notFound();

  const totalCandidaturas = await contarCandidaturas(vaga.id);

  return (
    <article>
      <h1>{vaga.titulo}</h1>

      <p className="text-suave">
        <Link href={`/empresas/${vaga.empresaSlug}`} className="text-principal">
          {vaga.empresa}
        </Link>
        {" · "}
        {vaga.area} · {vaga.senioridade} · {vaga.local}
      </p>
      <p className="text-suave">
        <strong className="text-principal">{totalCandidaturas}</strong> candidatura(s)
      </p>

      {vaga.aceitaIniciante && (
        <p className="w-fit rounded-full bg-sucesso-fundo px-3 py-1 text-sm font-medium text-sucesso">
          Aceita quem está começando
        </p>
      )}

      <BotaoCopiarLink titulo={vaga.titulo} />

      <section>
        <h2>Descrição da vaga</h2>
        <DescricaoDaVaga texto={vaga.descricao} />
      </section>

      <section>
        <h2>Candidatar-se</h2>
        <FormularioDeCandidatura vagaId={vaga.id} tituloDaVaga={vaga.titulo} />
      </section>
    </article>
  );
}