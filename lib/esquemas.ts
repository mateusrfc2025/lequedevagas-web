import { z } from "zod";

export const EsquemaDaVaga = z.object({
  titulo: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  area: z.string().min(1, "Selecione a área"),
  senioridade: z.string().min(1, "Selecione a senioridade"),
  local: z.string().min(1, "Informe o local"),
  // checkbox desmarcado: a chave nem chega. Marcado: chega "on".
  aceitaIniciante: z.literal("on").optional().transform((val) => val === "on"),
  descricao: z
    .string()
    .min(20, "Descreva a vaga com pelo menos 20 caracteres")
    .max(2000, "A descrição da vaga não pode ultrapassar 2000 caracteres"),
});

export type DadosDaVaga = z.infer<typeof EsquemaDaVaga>;

// O slug NÃO entra aqui de propósito: ele não pode ser editado.
export const EsquemaDaEmpresa = z.object({
  nome: z.string().min(2, "O nome precisa ter pelo menos 2 letras."),
  sobre: z
    .string()
    .min(20, "Conte um pouco mais sobre a empresa (pelo menos 20 caracteres).")
    .max(600, "A descrição da empresa não pode ultrapassar 600 caracteres"),
  site: z.string().url("Informe uma URL válida, começando com https://"),
});

export type DadosDaEmpresa = z.infer<typeof EsquemaDaEmpresa>;

// (aula 09) Nome e e-mail vêm da CONTA de quem está logado, e não do formulário.
export const EsquemaDaCandidatura = z.object({
  vagaId: z.string().min(1, "Vaga não informada."),
  habilidades: z
    .array(z.string().min(1))
    .min(1, "Adicione pelo menos uma habilidade.")
    .max(20, "No máximo 20 habilidades."),
});

export const EsquemaDeArquivar = z.object({
  id: z.string().min(1, "Vaga não informada."),
});

export const EsquemaDoLogin = z.object({
  email: z.string().email("Informe um e-mail válido."),
  senha: z.string().min(1, "Informe a senha."),
});

// (aula 09) O cadastro: o papel não entra, a conta nasce candidata.
export const EsquemaDoCadastro = z.object({
  nome: z.string().min(3, "Informe seu nome (pelo menos 3 letras)."),
  email: z.string().email("Informe um e-mail válido."),
  senha: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres."),
});