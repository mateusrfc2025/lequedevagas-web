import { Vaga } from "./tipos";
import { Empresa } from "./tipos";

export default async function listarVagas() {
  const resposta = await fetch("https://raw.githubusercontent.com/mateusrfc2025/lequedevagas-web/refs/heads/main/dados/vagas.json", {
    next: { revalidate: 60 },
  });
  const vagas: Vaga[] = await resposta.json();

  return vagas
}
export async function listarEmpresas() {
  const resposta = await fetch("https://raw.githubusercontent.com/mateusrfc2025/lequedevagas-web/refs/heads/main/dados/empresas.json", {
    next: { revalidate: 60 },
  });
  const empresas: Empresa[] = await resposta.json();
  return empresas;
}
export async function buscarEmpresa(slug: string) {
  const empresas = await listarEmpresas();
  return empresas.find((e) => e.slug === slug);
}