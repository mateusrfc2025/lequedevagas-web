export type Vaga = {
  /** Texto, não número: o que vem da URL é sempre texto. */
  id: string;
  titulo: string;
  empresa: string;
  /** Tem que existir em `data/empresas.ts`, escrito igualzinho. */
  empresaSlug: string;
  /** Front-end · Back-end · Dados · Mobile · QA · Design */
  area: string;
  /** Estágio · Júnior · Pleno */
  senioridade: string;
  /** Remoto · Híbrido · Presencial, com a cidade quando não é remoto. */
  local: string;
  aceitaIniciante: boolean;
  /** No mínimo 300 caracteres: o "ver mais" precisa ter o que esconder. */
  descricao: string;
};
export type Empresa = {
  slug: string;
  nome: string;
  sobre: string;
  site: string;
};