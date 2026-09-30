"use server";

import { EsquemaDaCandidatura } from "@/lib/esquemas";
import { porCampo, valoresDe } from "@/lib/formulario";
import { buscarVagaPorId, guardarCandidatura } from "@/lib/api";
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

  await guardarCandidatura({
    ...analise.data,
    habilidades,
    id: crypto.randomUUID(),
    enviadaEm: new Date().toISOString(),
  });

  // sem revalidate: nenhuma tela pública mostra candidaturas
  return { ok: true, erros: {}, valores, mensagem: "Candidatura enviada!" };
}