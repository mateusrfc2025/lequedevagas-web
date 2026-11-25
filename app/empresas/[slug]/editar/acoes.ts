"use server";

import { updateTag } from "next/cache";
import { EsquemaDaEmpresa } from "@/lib/esquemas";
import { porCampo, valoresDe } from "@/lib/formulario";
import { guardarEmpresa } from "@/lib/api";
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

  // PUT /empresas/{slug}. A API valida de novo:
  // nome 2–80, sobre 20–600, site começando com https://
  const gravou = await guardarEmpresa(slug, analise.data);
  if (!gravou.ok) {
    return {
      ok: false,
      erros: gravou.erros,
      valores,
      mensagem: gravou.mensagem,
    };
  }

  // "vagas" também: o nome da empresa aparece nos cards das vagas.
  updateTag("empresas");
  updateTag("vagas");

  return { ok: true, erros: {}, valores, mensagem: "Perfil atualizado." };
}