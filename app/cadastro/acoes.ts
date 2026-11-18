"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { EsquemaDoCadastro } from "@/lib/esquemas";
import { porCampo, valoresDe } from "@/lib/formulario";
import type { Estado } from "@/lib/tipos";
import { signIn } from "@/auth";

export async function criarConta(
  estadoAnterior: Estado,
  dados: FormData,
): Promise<Estado> {
  const valores = valoresDe(dados);
  const analise = EsquemaDoCadastro.safeParse(Object.fromEntries(dados));

  if (!analise.success) {
    return { ok: false, erros: porCampo(analise.error), valores };
  }

  const { nome, email, senha } = analise.data;

  // Verifica se o e-mail já está em uso
  const existente = await prisma.pessoa.findUnique({ where: { email } });
  if (existente) {
    return {
      ok: false,
      erros: { email: "Este e-mail já está a ser utilizado." },
      valores,
    };
  }

  try {// 1. Cria a conta no banco com o papel forçado "candidata"
    const senhaHash = await bcrypt.hash(senha, 10);
    
    await prisma.pessoa.create({
      data: {
        nome,
        email,
        senha: senhaHash,
        papel: "candidata", 
      },
    });
    
    // 2. Faz o login automático com as credenciais recém-criadas
    // Usamos um bloco try/catch interno para redirecionar sem ser apanhado como erro genérico
    try {
        await signIn("credentials", {
            email,
            senha,
            redirect: false, 
        });
    } catch (authError) {
        console.error("Erro no login automático", authError);
    }
    
  } catch (erro: any) {
    return {
      ok: false,
      erros: { geral: "Ocorreu um erro ao criar a sua conta." },
      valores,
    };
  }

  // 3. Redireciona o utilizador logado para a página inicial (ou para o painel)
  redirect("/");
}