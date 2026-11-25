"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { EsquemaDaVaga } from "@/lib/esquemas";
import { porCampo, valoresDe } from "@/lib/formulario";
import { guardarVaga } from "@/lib/api";
import { usuarioAtual } from "@/lib/sessao";
import { podePublicar } from "@/lib/permissoes";
import type { Estado } from "@/lib/tipos";

export async function criarVaga(
  estadoAnterior: Estado,
  dados: FormData,
): Promise<Estado> {
  const valores = valoresDe(dados);

  // 0. QUEM ESTÁ CHAMANDO? Antes de validar qualquer campo.
  const quem = await usuarioAtual();
  if (!podePublicar(quem)) {
    return {
      ok: false,
      erros: {},
      valores,
      mensagem: "Só quem publica por uma empresa pode abrir vaga.",
    };
  }

  // 1. Primeira camada: o Zod (ex.: descrição com menos de 80 caracteres).
  const analise = EsquemaDaVaga.safeParse(Object.fromEntries(dados));
  if (!analise.success) {
    return { ok: false, erros: porCampo(analise.error), valores };
  }

  // 2. Segunda camada: a API. A empresa vem da SESSÃO, nunca do formulário.
  //    O id, a data e o nome da empresa quem define é a API.
  const gravou = await guardarVaga(
    { ...analise.data, empresaSlug: quem.empresaSlug },
    quem.id,
  );

  if (!gravou.ok) {
    // Os "campos" da API chegam direto como erros do formulário.
    return {
      ok: false,
      erros: gravou.erros,
      valores,
      mensagem: gravou.mensagem,
    };
  }

  // 3. Invalida o cache do mural, da empresa e do início.
  updateTag("vagas");

  redirect(`/vagas/${gravou.dado.id}`);
}