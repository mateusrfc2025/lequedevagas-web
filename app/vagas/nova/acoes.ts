"use server";
import { z } from "zod";
import { EsquemaDaVaga } from "@/lib/esquemas";

export type Estado = { ok: boolean; erros: Record<string, string> };

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
    return { ok: false, erros };
  }

  console.log("Vaga válida:", resultado.dados);
  return { ok: true, erros: {} };
}