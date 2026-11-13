"use server";
import { updateTag } from "next/cache";
import { guardarEmpresa } from "@/lib/api";
import { EsquemaDaEmpresa } from "@/lib/esquemas";
import { porCampo, valoresDe } from "@/lib/formulario";
import { podeEditarEmpresa } from "@/lib/permissoes";
import { usuarioAtual } from "@/lib/sessao";
import type { Estado } from "@/lib/tipos";

export async function salvarEmpresa(slug: string, estadoAnterior: Estado, dados: FormData): Promise<Estado> {
  const valores = valoresDe(dados);

  const quem = await usuarioAtual();
  if (!podeEditarEmpresa(quem, slug)) {
    return { ok: false, erros: {}, valores, mensagem: "Só quem fala por esta empresa pode editar o perfil." };
  }

  const analise = EsquemaDaEmpresa.safeParse(Object.fromEntries(dados));
  if (!analise.success) {
    return { ok: false, erros: porCampo(analise.error), valores };
  }

  // Na API. O upsert da aula 06 sai: o PUT troca o perfil.
  const gravou = await guardarEmpresa(slug, analise.data);
  if (!gravou.ok) {
    return { ok: false, erros: gravou.erros, valores, mensagem: gravou.mensagem };
  }

  // A API troca o nome da empresa dentro das vagas dela também.
  updateTag("empresas");
  updateTag("vagas");
  return { ok: true, erros: {}, valores: {}, mensagem: "Perfil salvo." };
}