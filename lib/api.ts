import { Vaga, Empresa } from "./tipos";

// 1. Listar Vagas (com export default e export named para servir às duas formas de import)
export default async function listarVagas(): Promise<Vaga[]> {
  const resposta = await fetch("https://raw.githubusercontent.com/mateusrfc2025/lequedevagas-web/refs/heads/main/dados/vagas.json", {
    next: { revalidate: 60, tags: ['vagas'] },
  });

  if (!resposta.ok) throw new Error("Falha ao buscar vagas");

  return resposta.json();
}

export { listarVagas };

// 2. Buscar Vaga por ID
export async function buscarVagaPorId(id: string): Promise<Vaga | undefined> {
  const vagas = await listarVagas();
  return vagas.find((v) => String(v.id) === String(id));
}


// 3. Listar Empresas
export async function listarEmpresas(): Promise<Empresa[]> {
  const resposta = await fetch("https://raw.githubusercontent.com/mateusrfc2025/lequedevagas-web/refs/heads/main/dados/empresas.json",
    {
      next: { revalidate: 60, tags: ["empresas"] },
    }
  );

  if (!resposta.ok) throw new Error("Falha ao buscar empresas");

  return resposta.json();
}



// 4. Buscar Empresa por Slug
export async function buscarEmpresa(slug: string): Promise<Empresa | undefined> {
    const empresas = await listarEmpresas();
  return empresas.find((e) => e.slug === slug);
}

export async function buscarVaga(id: string) {
  const vagas = await listarVagas();
  return vagas.find((v) => v.id === id);
}

