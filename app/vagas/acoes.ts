
"use server";

import { revalidatePath } from "next/cache";
import { EsquemaDeArquivar } from "@/lib/esquemas";
import { arquivarVaga } from "@/lib/api";
import { usuarioAtual } from "@/lib/sessao";
import { prisma } from "@/lib/prisma";
import { podeArquivar } from "@/lib/permissoes";

// Sem useActionState: não tem erro para mostrar, então recebe só o FormData.
export async function arquivar(dados: FormData) {
  const analise = EsquemaDeArquivar.safeParse(Object.fromEntries(dados));
  if (!analise.success) return;

  const quem = await usuarioAtual();
  if (!quem) return;

  // Busca o verdadeiro autor da vaga no banco, sem confiar no ID enviado pelo formulário.
  const vaga = await prisma.vaga.findUnique({
    where: { id: analise.data.id },
    select: { autorId: true },
  });

  // Só permite arquivar se a vaga pertencer à pessoa logada.
  if (!podeArquivar(quem, vaga)) return;

  await arquivarVaga(analise.data.id);

  // revalidatePath, e não revalidateTag: a lista de arquivadas vive na
  // MEMÓRIA, não num fetch. O tag só mandaria buscar o JSON de novo (que
  // volta igual). O que precisa ser refeito é a renderização da rota.
  revalidatePath("/vagas");
  revalidatePath("/");
  revalidatePath("/painel");
}
