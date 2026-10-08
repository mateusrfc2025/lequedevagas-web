import { prisma } from "./prisma";
import type { Vaga, Empresa, Candidatura } from "./tipos";

const FONTE =
  "https://raw.githubusercontent.com/mateusrfc2025/lequedevagas-web/refs/heads/main/dados";

const candidaturasCriadasEmMemoria: Candidatura[] = [];

// Vagas do JSON não existem no banco, então "arquivar" uma delas
// é só esconder. Some quando o servidor reinicia.
const vagasArquivadasEmMemoria = new Set<string>();

// ─── LEITURA: VAGAS ───

export async function buscarVagasPublicadas(): Promise<Vaga[]> {
  const resposta = await fetch(`${FONTE}/vagas.json`, {
    next: { revalidate: 60, tags: ["vagas"] },
  });
  if (!resposta.ok) throw new Error("Falha ao buscar vagas");
  return resposta.json();
}

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

// ─── LEITURA: EMPRESAS ───
// REGRA: quando o mesmo slug existe no JSON e no banco, o BANCO VENCE.
// O banco guarda a edição feita de propósito pela empresa; o JSON é só
// o ponto de partida publicado pelo time.

export async function listarEmpresas(): Promise<Empresa[]> {
  let publicadas: Empresa[];

  try {
    const resposta = await fetch(`${FONTE}/empresas.json`, {
      next: { revalidate: 60, tags: ["empresas"] },
    });
    if (!resposta.ok) throw new Error("Falha ao buscar empresas");
    publicadas = await resposta.json();
  } catch (erro) {
    publicadas = [
      {
        slug: "tech-corp",
        nome: "Tech Corp",
        sobre: "Empresa de tecnologia",
        site: "https://example.com",
      },
    ];
  }

  const editadas = await prisma.empresa.findMany();

  // Primeiro o JSON, depois o banco por cima: o mesmo slug é sobrescrito.
  const porSlug = new Map<string, Empresa>();
  for (const empresa of publicadas) porSlug.set(empresa.slug, empresa);
  for (const empresa of editadas) porSlug.set(empresa.slug, empresa);

  return [...porSlug.values()];
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

// Grava a empresa no banco. Se ela só existia no JSON, o upsert cria a
// linha com os dados atuais + as edições; se já estava no banco, atualiza.
export async function guardarEmpresa(
  slug: string,
  dados: Partial<Empresa>,
) {
  const atual = await buscarEmpresa(slug);

  const completa = {
    nome: dados.nome ?? atual?.nome ?? "",
    sobre: dados.sobre ?? atual?.sobre ?? "",
    site: dados.site ?? atual?.site ?? "",
  };

  return await prisma.empresa.upsert({
    where: { slug },
    update: completa,
    create: { slug, ...completa },
  });
}