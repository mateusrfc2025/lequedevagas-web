import { z } from "zod";

export const EsquemaDaVaga = z.object({
  titulo: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  empresaId: z.string().min(1, "Selecione uma empresa"),
  area: z.string().min(1, "Selecione a área"),
  senioridade: z.string().min(1, "Selecione a senioridade"),
  local: z.string().min(1, "Informe o local"),
  aceitaIniciante: z.boolean().default(false),
  descricao: z.string().min(10, "A descrição deve ter no mínimo 10 caracteres"),
});

export type DadosDaVaga = z.infer<typeof EsquemaDaVaga>;