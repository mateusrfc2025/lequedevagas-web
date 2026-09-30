import type { Vaga, Empresa, Candidatura } from "./tipos";

const FONTE =
  "https://raw.githubusercontent.com/mateusrfc2025/lequedevagas-web/refs/heads/main/dados";

// Memória do PROCESSO: some quando o servidor reinicia. É de propósito.
// Na aula 06 estas linhas viram um banco de dados.
const vagasCriadasEmMemoria: Vaga[] = [];
const vagasArquivadasEmMemoria = new Set<string>();
const candidaturasCriadasEmMemoria: Candidatura[] = [];
const empresasEditadasEmMemoria: Record<string, Partial<Empresa>> = {};

// revalidate: 60 → as vagas mudam poucas vezes por dia, então um minuto de
// atraso é aceitável e evita buscar no GitHub a cada visita.
// Pior caso: uma vaga nova no JSON leva cerca de 60 segundos para aparecer.
export default async function listarVagas(): Promise<Vaga[]> {
  const resposta = await fetch(`${FONTE}/vagas.json`, {
    next: { revalidate: 60, tags: ["vagas"] },
  });
  if (!resposta.ok) throw new Error("Falha ao buscar vagas");
  const vagasIniciais: Vaga[] = await resposta.json();

  return [...vagasCriadasEmMemoria, ...vagasIniciais].filter(
    (vaga) => !vagasArquivadasEmMemoria.has(String(vaga.id)),
  );
}

export { listarVagas };

export async function buscarVagaPorId(id: string): Promise<Vaga | undefined> {
  const vagas = await listarVagas();
  return vagas.find((v) => String(v.id) === String(id));
}

export async function listarEmpresas(): Promise<Empresa[]> {
  const resposta = await fetch(`${FONTE}/empresas.json`, {
    next: { revalidate: 60, tags: ["empresas"] },
  });
  if (!resposta.ok) throw new Error("Falha ao buscar empresas");
  const empresasIniciais: Empresa[] = await resposta.json();

  return empresasIniciais.map((empresa) => ({
    ...empresa,
    ...empresasEditadasEmMemoria[empresa.slug],
  }));
}

export async function buscarEmpresa(slug: string): Promise<Empresa | undefined> {
  const empresas = await listarEmpresas();
  return empresas.find((e) => e.slug === slug);
}

// ─── ESCRITA ───
export async function guardarVaga(vaga: Vaga) {
  vagasCriadasEmMemoria.unshift(vaga); // no começo: a mais nova aparece primeiro
  return vaga;
}

export async function arquivarVaga(id: string) {
  // vale para vaga criada aqui E para vaga que veio do JSON
  vagasArquivadasEmMemoria.add(String(id));
  return { id, arquivada: true };
}

export async function guardarCandidatura(candidatura: Candidatura) {
  candidaturasCriadasEmMemoria.unshift(candidatura);
  return candidatura;
}

export async function guardarEmpresa(slug: string, dados: Partial<Empresa>) {
  empresasEditadasEmMemoria[slug] = {
    ...empresasEditadasEmMemoria[slug],
    ...dados,
  };
  return { slug, ...dados };
}