"use server";

import { revalidatePath } from "next/cache";
import { EsquemaDeArquivar } from "@/lib/esquemas";
import { arquivarVaga } from "@/lib/api";

// Sem useActionState: não tem erro para mostrar, então recebe só o FormData.
export async function arquivar(dados: FormData) {
  const analise = EsquemaDeArquivar.safeParse(Object.fromEntries(dados));
  if (!analise.success) return;

  await arquivarVaga(analise.data.id);

  // revalidatePath, e não revalidateTag: a lista de arquivadas vive na
  // MEMÓRIA, não num fetch. O tag só mandaria buscar o JSON de novo (que
  // volta igual). O que precisa ser refeito é a renderização da rota.
  revalidatePath("/vagas");
  revalidatePath("/");
}