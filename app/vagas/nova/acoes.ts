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

  // 1. DESCONFIE: valida antes de qualquer outra coisa
  const analise = EsquemaDaVaga.safeParse(Object.fromEntries(dados));
  if (!analise.success) {
    return { ok: false, erros: porCampo(analise.error), valores };
  }

  // 2. REGRA QUE O ZOD NÃO SABE: a empresa existe?
  const empresa = await buscarEmpresa(analise.data.empresaSlug);
  if (!empresa) {
    return {
      ok: false,
      erros: { empresaSlug: "Essa empresa não está cadastrada." },
      valores,
    };
  }

  // 3. O id nasce AQUI, no servidor, nunca vindo do formulário
  const vaga: Vaga = {
    ...analise.data,
    id: crypto.randomUUID(),
    empresa: empresa.nome,
  };
  await guardarVaga(vaga);

  // 4. Avisa o cache (a listagem e os números da home)
  revalidatePath("/vagas");
  revalidatePath("/");

  // 5. redirect por último, fora de qualquer try/catch
  redirect(`/vagas/${vaga.id}`);
}