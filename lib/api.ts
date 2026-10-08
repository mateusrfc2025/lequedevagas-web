import { prisma } from "./prisma";
import type { Empresa, Candidatura } from "./tipos";

const FONTE =
  "https://raw.githubusercontent.com/mateusrfc2025/lequedevagas-web/refs/heads/main/dados";

const candidaturasCriadasEmMemoria: Candidatura[] = [];
const empresasEditadasEmMemoria: Record<string, Partial<Empresa>> = {};

export async function listarVagas() {
  return await prisma.vaga.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function buscarVagaPorId(id: string) {
  return await prisma.vaga.findUnique({
    where: { id },
  });
}

export async function listarEmpresas(): Promise<Empresa[]> {
  try {
    const resposta = await fetch(`${FONTE}/empresas.json`, {
      next: { revalidate: 60, tags: ["empresas"] },
    });
    if (!resposta.ok) throw new Error("Falha ao buscar empresas");
    const empresasIniciais: Empresa[] = await resposta.json();

    return empresasIniciais.map((empresa) => ({
      ...empresa,
      ...empresasEditadasEmMemoria[empresa.slug],
    }));
  } catch (erro) {
    return [
      {
        slug: "tech-corp",
        nome: "Tech Corp",
        sobre: "Empresa de tecnologia",
        site: "https://example.com",
      },
    ];
  }
}

export async function buscarEmpresa(
  slug: string,
): Promise<Empresa | undefined> {
  const empresas = await listarEmpresas();

  return empresas.find((e) => e.slug === slug);
}

// ─── ESCRITA ───
export async function guardarVaga(dados: any) {
  return await prisma.vaga.create({
    data: {
      titulo: dados.titulo,
      empresa: dados.empresa,
      empresaSlug: dados.empresaSlug || "empresa",
      area: dados.area,
      senioridade: dados.senioridade,
      local: dados.local,
      descricao: dados.descricao,
      aceitaIniciante: Boolean(dados.aceitaIniciante),
    },
  });
}

export async function arquivarVaga(id: string) {
  return await prisma.vaga.delete({
    where: { id },
  });
}

export async function guardarCandidatura(candidatura: Candidatura) {
  candidaturasCriadasEmMemoria.unshift(candidatura);
  return candidatura;
}

export async function guardarEmpresa(
  slug: string,
  dados: Partial<Empresa>,
) {
  empresasEditadasEmMemoria[slug] = {
    ...empresasEditadasEmMemoria[slug],
    ...dados,
  };

  return { slug, ...dados };
}