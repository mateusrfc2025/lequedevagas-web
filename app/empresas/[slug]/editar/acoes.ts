"use server";

import { revalidatePath } from "next/cache";
import { EsquemaDaEmpresa } from "@/lib/esquemas";
import { porCampo, valoresDe } from "@/lib/formulario";
import { buscarEmpresa, guardarEmpresa } from "@/lib/api";
import type { Estado } from "@/lib/tipos";

export async function salvarEmpresa(
  slug: string,
  estadoAnterior: Estado,
  dados: FormData,
): Promise<Estado> {
  const valores = valoresDe(dados);

  const analise = EsquemaDaEmpresa.safeParse(Object.fromEntries(dados));
  if (!analise.success) {
    return { ok: false, erros: porCampo(analise.error), valores };
  }

  const atual = await buscarEmpresa(slug);
  if (!atual) {
    // Falha que não é de campo nenhum: vai na `mensagem`, não em `erros`.
    return { ok: false, erros: {}, valores, mensagem: "Empresa não encontrada." };
  }

  guardarEmpresa(slug, analise.data);

  revalidatePath(`/empresas/${slug}`);
  revalidatePath("/empresas");

  return { ok: true, erros: {}, valores, mensagem: "Perfil atualizado." };
}