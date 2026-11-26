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

  /* O PAPEL NÃO VEM DO FORMULÁRIO, e nem vai para a API: sem papel, ela cria
     a conta como candidata. O hash, quem faz é ela. O e-mail repetido, quem
     recusa também: 409, com a mensagem embaixo do campo. */
  const gravou = await guardarPessoa({ nome, email, senha });
  if (!gravou.ok) {
    return { ok: false, erros: gravou.erros, valores };
  }

  // Cadastrou, já entra — o mesmo signIn da aula 07, que agora confere na API.
  await signIn("credentials", { email, senha, redirectTo: "/painel" });
  return { ok: true, erros: {}, valores };
}