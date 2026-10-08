import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buscarVagaPorId, listarVagas } from "@/lib/api";
import DescricaoDaVaga from "@/components/DescricaoDaVaga";
import BotaoCopiarLink from "@/components/BotaoCopiarLink";
import FormularioDeCandidatura from "@/components/FormularioDeCandidatura";

type VagaPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: VagaPageProps): Promise<Metadata> {
  const { id } = await params;
  const vaga = await buscarVagaPorId(id);

  return {
    title: vaga ? `${vaga.titulo} - Leque de Vagas` : "Vaga não encontrada",
  };
}

export async function generateStaticParams() {
  const vagas = await listarVagas();
  return vagas.map((vaga: { id: string | number }) => ({ id: String(vaga.id) }));
}

export default async function VagaPage({ params }: VagaPageProps) {
  const { id } = await params;
  const vaga = await buscarVagaPorId(id);

  if (!vaga) {
    notFound();
  }

  return (
    <article>
      <h1>{vaga.titulo}</h1>

      <p>
        <strong>Empresa:</strong>{" "}
        <Link href={`/empresas/${vaga.empresaSlug}`}>{vaga.empresa}</Link>
      </p>
      <p>
        <strong>Área:</strong> {vaga.area}
      </p>
      <p>
        <strong>Senioridade:</strong> {vaga.senioridade}
      </p>
      <p>
        <strong>Local:</strong> {vaga.local}
      </p>

      {vaga.aceitaIniciante && (
        <p>
          <span className="selo">aceita iniciante</span>
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