"use server";
import { updateTag } from "next/cache";
import { arquivarVaga, buscarVaga } from "@/lib/api";
import { EsquemaDeArquivar } from "@/lib/esquemas";
import { podeArquivar } from "@/lib/permissoes";
import { usuarioAtual } from "@/lib/sessao";

export async function arquivar(dados: FormData) {
  const analise = EsquemaDeArquivar.safeParse(Object.fromEntries(dados));
  if (!analise.success) return;

  // O id do campo escondido pode ser trocado: a ação busca a vaga na API,
  // e é a vaga que diz quem é o autor.
  const [quem, vaga] = await Promise.all([usuarioAtual(), buscarVaga(analise.data.id)]);
  if (!vaga || !podeArquivar(quem, vaga)) return;

  await arquivarVaga(vaga.id);
  updateTag("vagas");
}