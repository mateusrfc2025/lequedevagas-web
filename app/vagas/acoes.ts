
"use server";

import { updateTag } from "next/cache";
import { arquivarVaga, buscarVagaPorId } from "@/lib/api";
import { EsquemaDeArquivar } from "@/lib/esquemas";
import { podeArquivar } from "@/lib/permissoes";
import { usuarioAtual } from "@/lib/sessao";

export async function arquivar(dados: FormData) {
  const analise = EsquemaDeArquivar.safeParse(Object.fromEntries(dados));
  if (!analise.success) return;

  // Busca o usuário logado e a vaga diretamente na API.
  const [quem, vaga] = await Promise.all([
    usuarioAtual(),
    buscarVagaPorId(analise.data.id),
  ]);

  // Só permite arquivar se a vaga pertencer à pessoa logada.
  if (!vaga || !podeArquivar(quem, vaga)) return;

  await arquivarVaga(vaga.id);

  // Atualiza os números e as listas que usam a etiqueta "vagas".
  updateTag("vagas");
}
