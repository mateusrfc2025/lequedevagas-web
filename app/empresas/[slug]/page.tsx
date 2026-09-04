// SEM "use client". É uma página de servidor, e continua sendo.
import type { Metadata } from "next";
import { notFound } from "next/navigation"
import listarVagas from "@/lib/api";
import { listarEmpresas, buscarEmpresa } from "@/lib/api";
import AbasDaEmpresa from "@/components/AbasDaEmpresa";

export async function generateStaticParams() {
  const empresas = await listarEmpresas();
  return empresas.map((empresa) => ({ slug: empresa.slug, }));
}

export async function generateMetadata({
  params,
}: {
  // "slug", porque a pasta se chama [slug]
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  // await params: igualzinho à aula 02. A fronteira não mudou isso.
  const { slug } = await params;
  const empresa = await buscarEmpresa(slug);
  return {
    title: empresa? `${empresa.nome} - Vagas` : "Empresa não encontrada",
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
  // O cruzamento acontece AQUI, no servidor, antes de a tela existir.
  const vagasDaEmpresa = vagas.filter((v) => v.empresaSlug === slug);

  return (
    <article>
      <h1>{empresa.nome}</h1>
      <p>
        <a href={empresa.site} target="_blank" rel="noopener noreferrer">
          {empresa.site}
        </a>
      </p>
      <AbasDaEmpresa sobre={empresa.sobre} vagas={vagasDaEmpresa} />
    </article>
  );
}
