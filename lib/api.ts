import type { Vaga, Empresa } from "./tipos";

const vagasCriadasEmMemoria: Vaga[] = [];
const candidaturasCriadasEmMemoria: any[] = [];
const empresasEditadasEmMemoria: Record<string, Partial<Empresa>> = {};

export default async function listarVagas(): Promise<Vaga[]> {
  const resposta = await fetch(
    "https://raw.githubusercontent.com/mateusrfc2025/lequedevagas-web/refs/heads/main/dados/vagas.json",
    { next: { revalidate: 60, tags: ["vagas"] } }
  );
  if (!resposta.ok) throw new Error("Falha ao buscar vagas");
  const vagasIniciais: Vaga[] = await resposta.json();
  return [...vagasCriadasEmMemoria, ...vagasIniciais];
}

export { listarVagas };

export async function buscarVagaPorId(id: string): Promise<Vaga | undefined> {
  const vagas = await listarVagas();
  return vagas.find((v) => String(v.id) === String(id));
}

export async function listarEmpresas(): Promise<Empresa[]> {
  const resposta = await fetch(
    "https://raw.githubusercontent.com/mateusrfc2025/lequedevagas-web/refs/heads/main/dados/empresas.json",
    { next: { revalidate: 60, tags: ["empresas"] } }
  );
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

export async function guardarVaga(vaga: any) {
  vagasCriadasEmMemoria.unshift(vaga);
  return vaga;
}

export async function arquivarVaga(id: string) {
  const indice = vagasCriadasEmMemoria.findIndex((v) => String(v.id) === String(id));
  if (indice !== -1) vagasCriadasEmMemoria.splice(indice, 1);
  return { id, arquivada: true };
}

export async function guardarCandidatura(candidatura: any) {
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