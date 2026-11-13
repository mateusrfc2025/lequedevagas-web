import { cache } from "react";
import { auth } from "@/auth";
import { buscarPessoa } from "@/lib/api";

/* O crachá diz o id; a API diz o resto. O `cache` faz a pergunta UMA vez por pedido. */
export const usuarioAtual = cache(async () => {
  const sessao = await auth();
  const id = sessao?.user?.id;
  if (!id) return null;
  return buscarPessoa(id);
});

export type Quem = NonNullable<Awaited<ReturnType<typeof usuarioAtual>>>;