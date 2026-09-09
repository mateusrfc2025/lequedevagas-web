import { listarVagas, buscarVagaPorId } from "@/lib/api";

export async function generateStaticParams() {
  const vagas = await listarVagas();
  return vagas.map((vaga) => ({
    id: String(vaga.id),
  }));
}

export default async function VagaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vaga = await buscarVagaPorId(id);

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold">{vaga?.titulo}</h1>
      <p>{vaga?.descricao}</p>
    </main>
  );
}