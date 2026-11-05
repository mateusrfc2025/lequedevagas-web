import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buscarEmpresa } from "@/lib/api";
import { usuarioAtual } from "@/lib/sessao";
import { podeEditarEmpresa } from "@/lib/permissoes";
import FormularioDaEmpresa from "./formulario";

export const metadata: Metadata = {
  title: "Editar empresa · Leque de Vagas",
};

export default async function EditarEmpresa({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const empresa = await buscarEmpresa(slug);
  if (!empresa) notFound();

  const quem = await usuarioAtual();
  if (!podeEditarEmpresa(quem, empresa.slug)) {
    return (
      <section>
        <h1>Editar {empresa.nome}</h1>
        <p>Só quem fala pela {empresa.nome} edita este perfil.</p>
        <p>
          <Link href={`/empresas/${empresa.slug}`}>← voltar para a empresa</Link>
        </p>
      </section>
    );
  }

  return (
    <section>
      <h1>Editar {empresa.nome}</h1>
      <FormularioDaEmpresa empresa={empresa} />
    </section>
  );
}
