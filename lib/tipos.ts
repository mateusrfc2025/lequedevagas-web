export type Vaga = {
  /** Texto, não número: o que vem da URL é sempre texto. */
  id: string;
  titulo: string;
  empresa: string;
  empresaSlug: string;
  /** Front-end · Back-end · Dados · Mobile · QA · Design */
  area: string;
  /** Estágio · Júnior · Pleno */
  senioridade: string;
  /** Remoto · Híbrido · Presencial, com a cidade quando não é remoto. */
  local: string;
  aceitaIniciante: boolean;
  descricao: string;
  /** A API preenche: data ISO em texto. */
  publicadaEm: string;
  arquivada: boolean;
  /** Quem publicou. As vagas antigas podem não ter. */
  autorId: string | null;
};

/** O que o formulário manda. id, empresa, data e arquivada vêm da API. */
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

/** A conta como a API devolve: sem senha e sem hash. */
export type Pessoa = {
  id: string;
  nome: string;
  email: string;
  papel: "candidata" | "empresa";
  empresaSlug: string | null;
};

export type Estado = {
  ok: boolean;
  erros: Record<string, string>;
  valores: Record<string, string>;
  mensagem?: string;
};
export const EstadoInicial: Estado = { ok: false, erros: {}, valores: {} };

export type Candidatura = {
  id: string;
  vagaId: string;
  pessoaId: string | null;
  nome: string;
  email: string;
  habilidades: string[];
  enviadaEm: string;
};

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
