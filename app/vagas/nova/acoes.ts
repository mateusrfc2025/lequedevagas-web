"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { EsquemaDaVaga } from "@/lib/esquemas";
import { porCampo, valoresDe } from "@/lib/formulario";
import { guardarVaga, buscarEmpresa } from "@/lib/api";
import type { Estado, Vaga } from "@/lib/tipos";

export async function criarVaga(
  estadoAnterior: Estado,
  dados: FormData,
): Promise<Estado> {
  const valores = valoresDe(dados);

  const analise = EsquemaDaVaga.safeParse(Object.fromEntries(dados));

  if (!analise.success) {
    return { ok: false, erros: porCampo(analise.error), valores };
  }

  const empresa = await buscarEmpresa(analise.data.empresaSlug);

  if (!empresa) {
    return {
      ok: false,
      erros: { empresaSlug: "Essa empresa não está cadastrada." },
      valores,
    };
  }

  const vaga: Vaga = {
    ...analise.data,
    id: crypto.randomUUID(),
    empresa: empresa.nome,
  };

  await guardarVaga(vaga);

  revalidatePath("/vagas");
  revalidatePath("/");

  redirect(`/vagas/${vaga.id}`);
}