"use server";
import { updateTag } from "next/cache";
import { guardarCandidatura } from "@/lib/api";
import { EsquemaDaCandidatura } from "@/lib/esquemas";
import { porCampo, valoresDe } from "@/lib/formulario";
import { podeCandidatar } from "@/lib/permissoes";
import { usuarioAtual } from "@/lib/sessao";
import type { Estado } from "@/lib/tipos";

export async function enviarCandidatura(estadoAnterior: Estado, dados: FormData): Promise<Estado> {
  const valores = valoresDe(dados);

  const quem = await usuarioAtual();
  if (!podeCandidatar(quem)) {
    return { ok: false, erros: {}, valores, mensagem: "Entre como candidata para se candidatar." };
  }

  // As habilidades são lista: getAll, e não Object.fromEntries.
  const analise = EsquemaDaCandidatura.safeParse({
    vagaId: dados.get("vagaId"),
    habilidades: dados.getAll("habilidades").map(String),
  });
  if (!analise.success) {
    return { ok: false, erros: porCampo(analise.error), valores };
  }

  // Nome e e-mail vêm da CONTA. A API confere se a vaga existe (404),
  // se está arquivada ou se a candidatura é repetida (409).
  const gravou = await guardarCandidatura(analise.data.vagaId, {
    nome: quem.nome,
    email: quem.email,
    habilidades: analise.data.habilidades,
    pessoaId: quem.id,
  });
  if (!gravou.ok) {
    return { ok: false, erros: gravou.erros, valores, mensagem: gravou.mensagem };
  }

  updateTag("candidaturas");
  return { ok: true, erros: {}, valores: {}, mensagem: "Candidatura enviada!" };
}