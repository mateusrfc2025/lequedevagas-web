"use server";
import { signIn } from "@/auth";
import { guardarPessoa } from "@/lib/api";
import { EsquemaDoCadastro } from "@/lib/esquemas";
import { porCampo, valoresDe } from "@/lib/formulario";
import type { Estado } from "@/lib/tipos";

export async function cadastrar(estadoAnterior: Estado, dados: FormData): Promise<Estado> {
  const valores = valoresDe(dados);
  delete valores.senha; // a senha nunca volta para a tela

  const analise = EsquemaDoCadastro.safeParse(Object.fromEntries(dados));
  if (!analise.success) {
    return { ok: false, erros: porCampo(analise.error), valores };
  }
  const { nome, email, senha } = analise.data;

  // O PAPEL NÃO VEM DO FORMULÁRIO: sem papel, a API cria candidata.
  // O hash e o e-mail repetido (409), quem cuida é a API.
  const gravou = await guardarPessoa({ nome, email, senha });
  if (!gravou.ok) {
    return { ok: false, erros: gravou.erros, valores, mensagem: gravou.mensagem };
  }

  // Cadastrou, já entra.
  await signIn("credentials", { email, senha, redirectTo: "/painel" });
  return { ok: true, erros: {}, valores };
}