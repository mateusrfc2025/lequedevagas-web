import { prisma } from "./prisma";
import type { Vaga, Empresa, Candidatura } from "./tipos";

const FONTE =
  "https://raw.githubusercontent.com/mateusrfc2025/lequedevagas-web/refs/heads/main/dados";

const candidaturasCriadasEmMemoria: Candidatura[] = [];
const empresasEditadasEmMemoria: Record<string, Partial<Empresa>> = {};

// Vagas do JSON não existem no banco, então "arquivar" uma delas
// é só esconder. Some quando o servidor reinicia.
const vagasArquivadasEmMemoria = new Set<string>();

// ─── LEITURA ───

// As vagas que vêm do vagas.json
export async function buscarVagasPublicadas(): Promise<Vaga[]> {
  const resposta = await fetch(`${FONTE}/vagas.json`, {
    next: { revalidate: 60, tags: ["vagas"] },
  });
  if (!resposta.ok) throw new Error("Falha ao buscar vagas");
  return resposta.json();
}

// Banco primeiro (as mais novas em cima), depois as do JSON
export async function listarVagas(): Promise<Vaga[]> {
  const criadas = await prisma.vaga.findMany({
    orderBy: { createdAt: "desc" },
  });
  const publicadas = await buscarVagasPublicadas();

  return [...criadas, ...publicadas].filter(
    (vaga) => !vagasArquivadasEmMemoria.has(String(vaga.id)),
  );
}

export async function buscarVagaPorId(id: string): Promise<Vaga | undefined> {
  const vagas = await listarVagas();
  return vagas.find((v) => String(v.id) === String(id));
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
  const noBanco = await prisma.vaga.findUnique({ where: { id } });

  if (noBanco) {
    await prisma.vaga.delete({ where: { id } });
  } else {
    // Veio do JSON: não dá pra apagar, só esconder
    vagasArquivadasEmMemoria.add(String(id));
  }

  return { id, arquivada: true };
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