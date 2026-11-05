"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { EsquemaDoLogin } from "@/lib/esquemas";
import { porCampo, valoresDe } from "@/lib/formulario";
import type { Estado } from "@/lib/tipos";

export async function entrar(
  estadoAnterior: Estado,
  dados: FormData,
): Promise<Estado> {
  const valores = valoresDe(dados);
  delete valores.senha; // a senha nunca volta para a tela

  const analise = EsquemaDoLogin.safeParse(Object.fromEntries(dados));
  if (!analise.success) {
    return { ok: false, erros: porCampo(analise.error), valores };
  }

  try {
    await signIn("credentials", {
      email: analise.data.email,
      senha: analise.data.senha,
      redirectTo: "/painel",
    });
  } catch (erro) {
    if (erro instanceof AuthError) {
      return { ok: false, erros: {}, valores, mensagem: "E-mail ou senha não conferem." };
    }
    throw erro; // o redirect é uma exceção: tem que subir
  }

  return { ok: true, erros: {}, valores };
}
