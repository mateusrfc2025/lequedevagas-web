"use server";
import { z } from "zod";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { EsquemaDaVaga } from "@/lib/esquemas";
import { guardarVaga, buscarEmpresa } from "@/lib/api";
import type { Estado } from "@/lib/tipos";
// o estado esta sendo exportado daqui, era para ser importado de lib/tipos.ts?
// e porCampo e valoresDe não estão sendo usados, então podem ser removidos?
//import { porCampo, valoresDe } from "@/lib/formulario";
//import type { Estado } from "@/lib/tipos";

type ResultadoValidacao =
  | { ok: true; dados: z.infer<typeof EsquemaDaVaga> }
  | { ok: false; erros: z.ZodError };

async function validarVaga(dados: FormData): Promise<ResultadoValidacao> {
  const analise = EsquemaDaVaga.safeParse(Object.fromEntries(dados));
  if (!analise.success) {
    return { ok: false, erros: analise.error };
  }
  return { ok: true, dados: analise.data };
}

export async function criarVaga(
  estadoAnterior: Estado,
  dados: FormData,
): Promise<Estado> {
  const resultado = await validarVaga(dados);

  if (!resultado.ok) {
    const erros: Record<string, string> = {};
    for (const problema of resultado.erros.issues) {
      const campo = String(problema.path[0] ?? "_");
      if (!erros[campo]) erros[campo] = problema.message;
    }
    return {
  ok: false,
  erros,
  valores: Object.fromEntries(dados) as Record<string, string>,};
  }

  const vaga = {
    id: randomUUID(),
    ...resultado.dados,
  };

  await guardarVaga(vaga);
  revalidatePath("/vagas");

  redirect(`/vagas/${vaga.id}`);
}