import { z } from "zod";

export const EsquemaDaVaga = z.object({
  titulo: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  empresaSlug: z.string().min(1, "Selecione uma empresa"),
  area: z.string().min(1, "Selecione a área"),
  senioridade: z.string().min(1, "Selecione a senioridade"),
  local: z.string().min(1, "Informe o local"),
  aceitaIniciante: z.literal("on").optional().transform((val) => val === "on"),
  descricao: z.string().min(20, "Descreva a vaga com pelo menos 20 caracteres") .max(2000, "A descrição da vaga não pode ultrapassar 2000 caracteres"),
});

export type DadosDaVaga = z.infer<typeof EsquemaDaVaga>;

export const EsquemaDaEmpresa = z.object({
  nome: z.string().min(2, "O nome precisa ter pelo menos 2 letras."),
  sobre: z.string().min(20, "Conte um pouco mais sobre a empresa (pelo menos 20 caracteres).") .max(600, "A descrição da empresa não pode ultrapassar 600 caracteres"),
  site: z.string().url("Informe uma URL válida, começando com https://"),
});

export type DadosDaEmpresa = z.infer<typeof EsquemaDaEmpresa>;

export const EsquemaDaCandidatura = z.object({
  nome: z.string().min(2, "Informe seu nome completo."),
  email: z.string().email("Informe um e-mail válido."),
  habilidades: z.string().min(10, "Liste suas habilidades com pelo menos 10 caracteres."),
});

export const EsquemaDeEArquivar = z.object({
  id: z.string().min(1, "ID da vaga é obrigatório."),
});