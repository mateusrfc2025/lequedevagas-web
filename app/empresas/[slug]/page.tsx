// SEM "use client". É uma página de servidor, e continua sendo.
import { notFound } from "next/navigation"
import { empresas } from "@/data/empresas";
import listarVagas from "@/lib/api";
import AbasDaEmpresa from "@/components/AbasDaEmpresa";

export default async function PaginaDaEmpresa({
  params,
}: {
  // "slug", porque a pasta se chama [slug]
  params: Promise<{ slug: string }>;
}) {
  // await params: igualzinho à aula 02. A fronteira não mudou isso.
  const { slug } = await params;
  const empresa = empresas.find((e) => e.slug === slug);
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

      {/* Um texto e uma lista de objetos atravessam a fronteira sem susto. */}
      <AbasDaEmpresa sobre={empresa.sobre} vagas={vagasDaEmpresa} />
    </article>
  );
}
