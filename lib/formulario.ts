"use server"

import { z, type ZodError } from "zod";

function porCampo(erro: ZodError): Record<string, string> {
  const erros: Record<string, string> = {};

  for (const problema of erro.issues) {
    const campo = String(problema.path[0] ?? "_");
    if (!erros[campo]) erros[campo] = problema.message;
  }
  return erros;
}
function valoresDe(dados: FormData): Record<string, string> {
  const valores: Record<string, string> = {};
  for (const [chave, valor] of dados.entries()) {
    if (typeof valor === "string") valores[chave] = valor;
  }
  return valores;
}

// esquema de validação usando mesma regra da aula 03
const EsquemaDaCandidatura = z.object({
  nome: z.string().min(1, "nome é obrigatório"),
  email: z.string().email("Isso não parece um e-mail"),
  habilidades: z.array(z.string()).min(1, "Adicione pelo menos uma habilidade"),
});

// Server Action
export async function enviarCandidatura(estadoAnterior: any, dados: FormData){
  
  // gera um atraso de 2 sec
  await new Promise((resolve) => setTimeout(resolve,2000));
  
  // textos normais extraidos
  const valoresTextuais = valoresDe(dados);
  const dadosBrutos = {
    ...valoresTextuais,
    habilidades: dados.getAll("habilidades"),
  };

  const validacao = EsquemaDaCandidatura.safeParse(dadosBrutos);

  if(!validacao.success){
    return {
      ok: false,
      erros: porCampo(validacao.error),
    };
  }

  return {
    ok:true,
    nome: validacao.data.nome,
  };
}