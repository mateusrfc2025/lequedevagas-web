
import type {
  Vaga,
  VagaNova,
  Empresa,
  Pessoa,
  Candidatura,
  CandidaturaComVaga,
  Numeros,
} from "./tipos";

// Não é segredo e é igual em todo ambiente: por isso não vai pro .env.
const API =
  "https://aulas.umlequedetecnologia.com.br/api/leque-de-vagas/equipe/lequedevagas-web";

// ─── AJUDANTES ───

/** GET. 404 → undefined. Outro erro → exceção (vai pro error.tsx). */
async function ler<T>(
  caminho: string,
  etiqueta: string | null,
): Promise<T | undefined> {
  const resposta = await fetch(
    `${API}${caminho}`,
    etiqueta
      ? { next: { revalidate: 60, tags: [etiqueta] } }
      : { cache: "no-store" },
  );

  if (resposta.status === 404) return undefined;
  if (!resposta.ok) {
    throw new Error(`API respondeu ${resposta.status} em GET ${caminho}`);
  }

  return (await resposta.json()) as T;
}

export type Gravou<T> =
  | { ok: true; dado: T }
  | {
      ok: false;
      status: number;
      erros: Record<string, string>;
      mensagem: string;
    };

/** POST/PUT/PATCH/DELETE. 4xx volta pro formulário; 5xx vira exceção. */
async function gravar<T>(
  metodo: "POST" | "PUT" | "PATCH" | "DELETE",
  caminho: string,
  corpo?: unknown,
): Promise<Gravou<T>> {
  const resposta = await fetch(`${API}${caminho}`, {
    method: metodo,
    headers: { "Content-Type": "application/json" },
    body: corpo === undefined ? undefined : JSON.stringify(corpo),
  });

  if (resposta.status >= 500) {
    throw new Error(`API respondeu ${resposta.status} em ${metodo} ${caminho}`);
  }

  if (resposta.status === 204) return { ok: true, dado: null as T };
  if (resposta.ok) return { ok: true, dado: (await resposta.json()) as T };

  const erro = await resposta.json().catch(() => ({}));

  return {
    ok: false,
    status: resposta.status,
    erros: erro.campos ?? {},
    mensagem: erro.erro ?? "Não foi possível gravar.",
  };
}

// ─── VAGAS (frente 1) ───

export async function listarVagas(): Promise<Vaga[]> {
  return (await ler<Vaga[]>("/vagas", "vagas")) ?? [];
}

export async function buscarNumeros(): Promise<Numeros> {
  const numeros = await ler<Numeros>("/numeros", "vagas");

  if (!numeros) throw new Error("GET /numeros respondeu 404");

  return numeros;
}

export async function buscarVagaPorId(id: string): Promise<Vaga | undefined> {
  return ler<Vaga>(`/vagas/${encodeURIComponent(id)}`, "vagas");
}

export async function guardarVaga(vaga: VagaNova, autorId: string) {
  return gravar<Vaga>("POST", "/vagas", { ...vaga, autorId });
}

// ─── EMPRESAS (frente 2) ───

export async function listarEmpresas(): Promise<Empresa[]> {
  return (await ler<Empresa[]>("/empresas", "empresas")) ?? [];
}

export async function buscarEmpresa(slug: string): Promise<Empresa | undefined> {
  return ler<Empresa>(`/empresas/${encodeURIComponent(slug)}`, "empresas");
}

export async function guardarEmpresa(
  slug: string,
  dados: Pick<Empresa, "nome" | "sobre" | "site">,
) {
  return gravar<Empresa>("PUT", `/empresas/${encodeURIComponent(slug)}`, dados);
}

// As vagas de UMA pessoa (painel da empresa).
export async function listarVagasDoAutor(autorId: string): Promise<Vaga[]> {
  return (
    (await ler<Vaga[]>(`/vagas?autor=${encodeURIComponent(autorId)}`, "vagas")) ?? []
  );
}

// ─── LOGIN (passo 7) ───

export async function conferirLogin(email: string, senha: string) {
  return gravar<Pessoa>("POST", "/sessoes", { email, senha });
}

// Sem cache: os dados da conta são lidos a cada pedido.
export async function buscarPessoa(id: string): Promise<Pessoa | undefined> {
  return ler<Pessoa>(`/pessoas/${encodeURIComponent(id)}`, null);
}

// ─── ARQUIVAR (frente 4): PATCH na API ───

export async function arquivarVaga(id: string) {
  return gravar<Vaga>("PATCH", `/vagas/${encodeURIComponent(id)}`, {
    arquivada: true,
  });
}

// ─── FRENTE 3 · PESSOAS E CANDIDATURAS ───

/** A senha vai em texto, por HTTPS, e quem faz o hash é a API. */
export async function guardarPessoa(pessoa: {
  nome: string;
  email: string;
  senha: string;
}) {
  return gravar<Pessoa>("POST", "/pessoas", pessoa);
}

export async function guardarCandidatura(
  vagaId: string,
  candidatura: {
    nome: string;
    email: string;
    habilidades: string[];
    pessoaId: string;
  },
) {
  return gravar<Candidatura>(
    "POST",
    `/vagas/${encodeURIComponent(vagaId)}/candidaturas`,
    candidatura,
  );
}

/** As candidaturas de UMA pessoa, cada uma com o título e a empresa da vaga. */
export async function listarCandidaturasDe(
  pessoaId: string,
): Promise<CandidaturaComVaga[]> {
  return (
    (await ler<CandidaturaComVaga[]>(
      `/pessoas/${encodeURIComponent(pessoaId)}/candidaturas`,
      "candidaturas",
    )) ?? []
  );
}

/** Quantas candidaturas uma vaga tem. */
export async function contarCandidaturas(vagaId: string): Promise<number> {
  const lista = await ler<Candidatura[]>(
    `/vagas/${encodeURIComponent(vagaId)}/candidaturas`,
    "candidaturas",
  );

  return lista?.length ?? 0;
}
