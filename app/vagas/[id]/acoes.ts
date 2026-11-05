"use server";

import { EsquemaDaCandidatura } from "@/lib/esquemas";
import { porCampo, valoresDe } from "@/lib/formulario";
import { buscarVagaPorId, guardarCandidatura } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import type { Estado } from "@/lib/tipos";

export async function enviarCandidatura(
  estadoAnterior: Estado,
  dados: FormData,
): Promise<Estado> {
  const valores = valoresDe(dados);

  const analise = EsquemaDaCandidatura.safeParse(Object.fromEntries(dados));
  if (!analise.success) {
    return { ok: false, erros: porCampo(analise.error), valores };
  }

  // lista: Object.fromEntries só guarda o último valor, por isso getAll
  const habilidades = dados.getAll("habilidades").map(String);
  if (habilidades.length === 0) {
    return {
      ok: false,
      erros: { habilidades: "Adicione pelo menos uma habilidade." },
      valores,
    };
  }

  const vaga = await buscarVagaPorId(analise.data.vagaId);
  if (!vaga) {
    return { ok: false, erros: {}, valores, mensagem: "Essa vaga não existe mais." };
  }

  try {
    await prisma.candidatura.create({
      data: {
        nome: analise.data.nome,
        email: analise.data.email,
        vagaId: analise.data.vagaId,
      }
    });

    return { ok: true, erros: {}, valores, mensagem: "Candidatura enviada!"};

  } catch (erro: any) {
    return {
      ok: false,
      erros: {
        geral: "Ocorreu um erro inesperado ao salvar sua candidatura."
      },
      valores,
    };
  }
}