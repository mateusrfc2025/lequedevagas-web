import { cache } from "react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// cache: a consulta roda uma vez por pedido, mesmo chamada em vários lugares.
export const usuarioAtual = cache(async () => {
  const sessao = await auth();
  const id = sessao?.user?.id;
  if (!id) return null;

  return prisma.pessoa.findUnique({
    where: { id },
    select: { id: true, nome: true, email: true, papel: true, empresaSlug: true },
  });
});

export type Quem = NonNullable<Awaited<ReturnType<typeof usuarioAtual>>>;