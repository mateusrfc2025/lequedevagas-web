import type { ZodError } from "zod";

// O Zod devolve uma LISTA de problemas; a tela quer UM por campo.
export function porCampo(erro: ZodError): Record<string, string> {
  const erros: Record<string, string> = {};

  for (const problema of erro.issues) {
    const campo = String(problema.path[0] ?? "_");
    // só a primeira mensagem de cada campo
    if (!erros[campo]) erros[campo] = problema.message;
  }

  return erros;
}

// Devolve o que a pessoa digitou, para o formulário voltar preenchido.
export function valoresDe(dados: FormData): Record<string, string> {
  const valores: Record<string, string> = {};

  for (const [chave, valor] of dados.entries()) {
    if (typeof valor === "string") valores[chave] = valor;
  }

  return valores;
}