
import { listarVagas, buscarVagaPorId } from "@/lib/api";
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
export async function generateStaticParams() {
  const vagas = await listarVagas();
  return vagas.map((vaga) => ({
    id: String(vaga.id),
  }));

}

export default async function VagaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const vaga = await buscarVagaPorId(id);
        
    const vaga = await buscarVaga(id);

  // 4. não achou? para tudo e mostra o not-found.tsx desta pasta
  if (!vaga) notFound();


  return (
    <main className="p-4">
      <h1 className="text-xl font-bold">{vaga?.titulo}</h1>
      <p>{vaga?.descricao}</p>
    </main>
  );
}