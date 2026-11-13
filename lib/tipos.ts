export type Vaga = {
  id: string;
  titulo: string;
  empresa: string;
  empresaSlug: string;
  area: string;
  senioridade: string;
  local: string;
  aceitaIniciante: boolean;
  descricao: string;
  // (aula 09) os três que a API dá, e o formulário nunca manda
  publicadaEm: string;
  arquivada: boolean;
  autorId: string | null;
};

/** (aula 09) O que o formulário manda para publicar. O resto, a API dá. */
export type VagaNova = Pick<
  Vaga,
  "titulo" | "empresaSlug" | "area" | "senioridade" | "local" | "aceitaIniciante" | "descricao"
>;

export type Empresa = {
  slug: string;
  nome: string;
  sobre: string;
  site: string;
};

/** (aula 09) Como a API devolve uma pessoa: sem a senha, nem o hash. */
export type Pessoa = {
  id: string;
  nome: string;
  email: string;
  papel: "candidata" | "empresa";
  empresaSlug: string | null;
};

export type Candidatura = {
  id: string;
  vagaId: string;
  pessoaId: string | null;
  nome: string;
  email: string;
  habilidades: string[];
  enviadaEm: string; // texto ISO, e não Date: é assim que chega pelo JSON
};

/** O que GET /pessoas/{id}/candidaturas devolve: a candidatura e um resumo da vaga. */
export type CandidaturaComVaga = Candidatura & {
  vaga: { id: string; titulo: string; empresa: string } | null;
};

export type Numeros = {
  total: number;
  aceitamIniciante: number;
  arquivadas: number;
  porArea: Record<string, number>;
  porSenioridade: Record<string, number>;
};

export type Estado = {
  ok: boolean;
  erros: Record<string, string>;
  valores: Record<string, string>;
  mensagem?: string;
};

export const EstadoInicial: Estado = { ok: false, erros: {}, valores: {} };