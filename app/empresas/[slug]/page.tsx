import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { listarVagas, listarEmpresas, buscarEmpresa } from "@/lib/api";
import AbasDaEmpresa from "@/components/AbasDaEmpresa";

export async function generateStaticParams() {
  const empresas = await listarEmpresas();
  return empresas.map((empresa) => ({ slug: empresa.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const empresa = await buscarEmpresa(slug);
  return {
    title: empresa ? `${empresa.nome} - Vagas` : "Empresa não encontrada",
    description: empresa?.sobre,
  };
}

export default async function PaginaDaEmpresa({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const empresa = await buscarEmpresa(slug);
  if (!empresa) notFound();

  const vagas = await listarVagas();
  const vagasDaEmpresa = vagas.filter((v) => v.empresaSlug === slug);

  return (
    <article>
      <h1>{empresa.nome}</h1>
      <AbasDaEmpresa empresa={empresa} vagas={vagasDaEmpresa} />
    </article>
  );
}
