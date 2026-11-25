import { cache } from "react";
import { auth } from "@/auth";
import { buscarPessoa } from "@/lib/api";

// cache: a consulta roda uma vez por pedido, mesmo chamada em vários lugares.
// O crachá (sessão) guarda só o id; o resto vem da API: GET /pessoas/{id}.
export const usuarioAtual = cache(async () => {
  const sessao = await auth();
  const id = sessao?.user?.id;
  if (!id) return null;

  return (await buscarPessoa(id)) ?? null;
});

export type Quem = NonNullable<Awaited<ReturnType<typeof usuarioAtual>>>;