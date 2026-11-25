import type { Vaga, VagaNova, Empresa, Pessoa, Candidatura } from "./tipos";

// Não é segredo e é igual em todo ambiente: por isso não vai pro .env.
const API =
  "https://aulas.umlequedetecnologia.com.br/api/leque-de-vagas/equipe/lequedevagas-web";

const candidaturasCriadasEmMemoria: Candidatura[] = [];

// ─── AJUDANTES ───

/** GET. 404 → undefined. Outro erro → exceção (vai pro error.tsx). */
async function ler<T>(caminho: string, etiqueta: string | null): Promise<T | undefined> {
  const resposta = await fetch(
    `${API}${caminho}`,
    etiqueta ? { next: { revalidate: 60, tags: [etiqueta] } } : { cache: "no-store" },
  );
  if (resposta.status === 404) return undefined;
  if (!resposta.ok) throw new Error(`API respondeu ${resposta.status} em GET ${caminho}`);
  return (await resposta.json()) as T;
}

export type Gravou<T> =
  | { ok: true; dado: T }
  | { ok: false; status: number; erros: Record<string, string>; mensagem: string };

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

  // 422, 409, 401, 404: { erro, status, campos }
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
  return (await ler<Vaga[]>(`/vagas?autor=${encodeURIComponent(autorId)}`, "vagas")) ?? [];
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
  return gravar<Vaga>("PATCH", `/vagas/${encodeURIComponent(id)}`, { arquivada: true });
}

// ─── AINDA NÃO MIGRADA (frente 3: não mexa) ───

export async function guardarCandidatura(candidatura: Candidatura) {
  candidaturasCriadasEmMemoria.unshift(candidatura);
  return candidatura;
}