"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { EsquemaDoLogin } from "@/lib/esquemas";
import { porCampo, valoresDe } from "@/lib/formulario";
import type { Estado } from "@/lib/tipos";

export async function entrar(
  estadoAnterior: Estado,
  dados: FormData,
): Promise<Estado> {
  const valores = valoresDe(dados);
  const analise = EsquemaDoLogin.safeParse(Object.fromEntries(dados));

  if (!analise.success) {
    return { ok: false, erros: porCampo(analise.error), valores };
  }

  const { email, senha } = analise.data;

  try {
    // O redirectTo diz para onde o usuário vai depois do login com sucesso
    await signIn("credentials", {
      email,
      senha,
      redirectTo: "/", 
    });
    
    return { ok: true, erros: {}, valores };
    
  } catch (erro) {
    if (erro instanceof AuthError) {
      switch (erro.type) {
        case "CredentialsSignin":
          return { ok: false, erros: { geral: "E-mail ou senha inválidos." }, valores };
        default:
          return { ok: false, erros: { geral: "Ocorreu um erro inesperado no login." }, valores };
      }
    }
    
    // O Next.js precisa que o erro de redirecionamento seja repassado para funcionar
    throw erro;
  }
}