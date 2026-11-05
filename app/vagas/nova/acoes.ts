"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { EsquemaDaVaga } from "@/lib/esquemas";
import { porCampo, valoresDe } from "@/lib/formulario";
import { guardarVaga, buscarEmpresa } from "@/lib/api";
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

  // 1. DESCONFIE do formulário.
  const analise = EsquemaDaVaga.safeParse(Object.fromEntries(dados));
  if (!analise.success) {
    return { ok: false, erros: porCampo(analise.error), valores };
  }

  // 2. A empresa vem da SESSÃO, nunca do formulário.
  const empresa = await buscarEmpresa(quem.empresaSlug);
  if (!empresa) {
    return {
      ok: false,
      erros: {},
      valores,
      mensagem: "Sua empresa não está cadastrada.",
    };
  }

  // 3. O dono da vaga é quem está na sessão.
  const vagaCriada = await guardarVaga(
    { ...analise.data, empresa: empresa.nome, empresaSlug: empresa.slug },
    quem.id,
  );

  revalidatePath("/vagas");
  revalidatePath("/");

  redirect(`/vagas/${vagaCriada.id}`);
}
