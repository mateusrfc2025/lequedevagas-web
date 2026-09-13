import { z } from "zod";

export const EsquemaDaVaga = z.object({
  titulo: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  empresaSlug: z.string().min(1, "Selecione uma empresa"),
  area: z.string().min(1, "Selecione a área"),
  senioridade: z.string().min(1, "Selecione a senioridade"),
  local: z.string().min(1, "Informe o local"),
  aceitaIniciante: z.literal("on").optional().transform((val) => val === "on"),
  descricao: z.string().min(20, "Descreva a vaga com pelo menos 20 caracteres"),
});

export type DadosDaVaga = z.infer<typeof EsquemaDaVaga>;

export const EsquemaDaEmpresa = z.object({
  nome: z.string().min(2, "O nome precisa ter pelo menos 2 letras."),
  sobre: z.string().min(20, "Conte um pouco mais sobre a empresa (pelo menos 20 caracteres)."),
  site: z.string().url("Informe uma URL válida, começando com https://"),
});

export type DadosDaEmpresa = z.infer<typeof EsquemaDaEmpresa>;