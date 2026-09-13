"use server";

import { z } from "zod";

const EsquemaDaVaga = z.object({
  titulo:      z.string().min(5, "O título precisa de pelo menos 5 letras."),
  empresaSlug: z.string().min(1, "Escolha a empresa."),
  local:       z.string().min(1, "Diga onde é."),
  aceitaIniciante: z.literal("on").optional().transform((v) => v === "on"),
  vagas: z.coerce.number().int().min(1, "Pelo menos uma posição."),
});

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
  await new Promise((ok) => setTimeout(ok, 3000));
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