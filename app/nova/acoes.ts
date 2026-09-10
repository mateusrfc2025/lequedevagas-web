"use server";  

import { z } from "zod";

const EsquemaDaVaga = z.object({
  titulo:      z.string().min(5, "O título precisa de pelo menos 5 letras."),
  empresaSlug: z.string().min(1, "Escolha a empresa."),
  local:       z.string().min(1, "Diga onde é."),

  aceitaIniciante: z.literal("on").optional().transform((v) => v === "on"),
  vagas: z.coerce.number().int().min(1, "Pelo menos uma posição."),

});

async function validarVaga(dados: FormData) {
    const analise = EsquemaDaVaga.safeParse(Object.fromEntries(dados));
    if (!analise.success) {
        return { ok: false, erros: analise.error };
    }
    return { ok: true, dados: analise.data }; 
}

export async function criarVaga(dados: FormData) {
    const resultado = await validarVaga(dados);
    console.log("resultado da validação:", resultado);
}
