"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { EsquemaDaVaga } from "@/lib/esquemas";
import { guardarVaga } from "@/lib/api";

export async function criarVaga(estadoAnterior: any, formData: FormData) {
  if (!formData || typeof formData.get !== "function") {
    return {
      erros: { geral: ["Dados inválidos."] },
      sucesso: false,
    };
  }

  const dadosBrutos = {
    titulo: formData.get("titulo"),
    empresaId: formData.get("empresaId"),
    area: formData.get("area"),
    senioridade: formData.get("senioridade"),
    local: formData.get("local"),
    aceitaIniciante: formData.get("aceitaIniciante") === "on",
    descricao: formData.get("descricao"),
  };

  const validacao = EsquemaDaVaga.safeParse(dadosBrutos);

  if (!validacao.success) {
    return {
      erros: validacao.error.flatten().fieldErrors,
      sucesso: false,
    };
  }

  const novaVaga = {
    id: crypto.randomUUID(),
    ...validacao.data,
  };

  await guardarVaga(novaVaga);

  revalidatePath("/vagas");
  redirect(`/vagas/${novaVaga.id}`);
}