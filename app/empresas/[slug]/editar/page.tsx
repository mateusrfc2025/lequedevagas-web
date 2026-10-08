import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buscarEmpresa } from "@/lib/api";
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

  return (
    <section>
      <h1>Editar {empresa.nome}</h1>
      <FormularioDaEmpresa empresa={empresa} />
    </section>
  );
}