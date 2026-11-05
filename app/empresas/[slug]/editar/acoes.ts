"use server";

import { revalidatePath } from "next/cache";
import { EsquemaDaEmpresa } from "@/lib/esquemas";
import { porCampo, valoresDe } from "@/lib/formulario";
import { buscarEmpresa, guardarEmpresa } from "@/lib/api";
import { usuarioAtual } from "@/lib/sessao";
import { podeEditarEmpresa } from "@/lib/permissoes";
import type { Estado } from "@/lib/tipos";

export async function salvarEmpresa(
  slug: string,
  estadoAnterior: Estado,
  dados: FormData,
): Promise<Estado> {
  const valores = valoresDe(dados);

  // O slug preso pelo .bind diz QUAL empresa; só a sessão diz QUEM pede.
  const quem = await usuarioAtual();
  if (!podeEditarEmpresa(quem, slug)) {
    return {
      ok: false,
      erros: {},
      valores,
      mensagem: "Só quem fala por esta empresa pode editar o perfil.",
    };
  }

  const analise = EsquemaDaEmpresa.safeParse(Object.fromEntries(dados));
  if (!analise.success) {
    return { ok: false, erros: porCampo(analise.error), valores };
  }

  const atual = await buscarEmpresa(slug);
  if (!atual) {
    return { ok: false, erros: {}, valores, mensagem: "Empresa não encontrada." };
  }

  await guardarEmpresa(slug, analise.data);
  revalidatePath(`/empresas/${slug}`);
  revalidatePath("/empresas");

  return { ok: true, erros: {}, valores, mensagem: "Perfil atualizado." };
}
