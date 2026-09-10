import { buscarVagaPorId, listarVagas } from "@/lib/api";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type VagaPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: VagaPageProps): Promise<Metadata> {
  const { id } = await params;

  const vaga = await buscarVagaPorId(id);

  return {
    title: vaga
      ? `${vaga.titulo} - Leque de Vagas`
      : "Vaga não encontrada",
  };
}

export async function generateStaticParams() {
  const vagas = await listarVagas();

  return vagas.map((vaga) => ({
    id: String(vaga.id),
  }));
}

export default async function VagaPage({
  params,
}: VagaPageProps) {
  const { id } = await params;

  const vaga = await buscarVagaPorId(id);

  if (!vaga) {
    notFound();
  }

  return (
    <main>
      <h1>{vaga.titulo}</h1>

      <p>
        <strong>Empresa:</strong> {vaga.empresa}
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
          <strong>Aceita iniciantes</strong>
        </p>
      )}

      <section>
        <h2>Descrição da vaga</h2>
        <p>{vaga.descricao}</p>
      </section>
    </main>
  );
}