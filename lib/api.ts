import type {
  Candidatura,
  CandidaturaComVaga,
  Empresa,
  Numeros,
  Pessoa,
  Vaga,
  VagaNova,
} from "@/lib/tipos";

/* ─── O ENDEREÇO ──────────────────────────────────────────────────────────
   A aula 04 avisou: quando a fonte trocar, é ESTA linha que muda. Trocou.
   O mesmo endereço para o localhost de todo mundo e para a Vercel.
   ATENÇÃO: o nome no fim tem que ser o MESMO que a equipe combinou. */
const API =
  "https://aulas.umlequedetecnologia.com.br/api/leque-de-vagas/equipe/lequedevagas-mateus-joao-fernando-jasmin";

/* ─── LER ─────────────────────────────────────────────────────────────────
   404 não é falha: é "não existe", e quem decide o que fazer é a página. */
async function ler<T>(caminho: string, etiqueta: string): Promise<T | undefined> {
  const resposta = await fetch(`${API}${caminho}`, {
    next: { revalidate: 60, tags: [etiqueta] },
  });
  if (resposta.status === 404) return undefined;
  if (!resposta.ok) throw new Error(`GET ${caminho} respondeu ${resposta.status}`);
  return resposta.json();
}

/* ─── GRAVAR ──────────────────────────────────────────────────────────────
   Recusa da API (422, 409, 401) volta para o formulário. API fora do ar
   (5xx) vira exceção e vai para o error.tsx. */
export type Gravou<T> =
  | { ok: true; dado: T }
  | { ok: false; status: number; erros: Record<string, string>; mensagem: string };

async function gravar<T>(metodo: string, caminho: string, corpo?: unknown): Promise<Gravou<T>> {
  const resposta = await fetch(`${API}${caminho}`, {
    method: metodo,
    headers: { "Content-Type": "application/json" },
    body: corpo === undefined ? undefined : JSON.stringify(corpo),
  });
  if (resposta.status >= 500) throw new Error(`${metodo} ${caminho} respondeu ${resposta.status}`);
  if (resposta.status === 204) return { ok: true, dado: null as T };
  const lido = await resposta.json();
  if (resposta.ok) return { ok: true, dado: lido };
  return { ok: false, status: resposta.status, erros: lido.campos ?? {}, mensagem: lido.erro };
}

/* ─── FRENTE 1 · VAGAS ──────────────────────────────────────────────────── */

export async function listarVagas(): Promise<Vaga[]> {
  return (await ler<Vaga[]>("/vagas", "vagas")) ?? [];
}

export async function buscarVaga(id: string): Promise<Vaga | undefined> {
  return ler<Vaga>(`/vagas/${encodeURIComponent(id)}`, "vagas");
}

/** Quem dá o id, a data e o nome da empresa é a API. */
export async function guardarVaga(vaga: VagaNova, autorId: string) {
  return gravar<Vaga>("POST", "/vagas", { ...vaga, autorId });
}

/* ─── FRENTE 2 · EMPRESAS ───────────────────────────────────────────────── */

export async function listarEmpresas(): Promise<Empresa[]> {
  return (await ler<Empresa[]>("/empresas", "empresas")) ?? [];
}

export async function buscarEmpresa(slug: string): Promise<Empresa | undefined> {
  return ler<Empresa>(`/empresas/${encodeURIComponent(slug)}`, "empresas");
}

/** O slug vai no endereço, e não no corpo: ele não muda. */
export async function guardarEmpresa(slug: string, empresa: Omit<Empresa, "slug">) {
  return gravar<Empresa>("PUT", `/empresas/${encodeURIComponent(slug)}`, empresa);
}

/** As vagas de UMA pessoa, para o painel. A API filtra. */
export async function listarVagasDoAutor(autorId: string): Promise<Vaga[]> {
  return (await ler<Vaga[]>(`/vagas?autor=${encodeURIComponent(autorId)}`, "vagas")) ?? [];
}

/* ─── FRENTE 3 · PESSOAS E CANDIDATURAS ─────────────────────────────────── */

/** A senha vai em texto, por HTTPS, e quem faz o hash é a API. Sem papel: nasce candidata. */
export async function guardarPessoa(pessoa: { nome: string; email: string; senha: string }) {
  return gravar<Pessoa>("POST", "/pessoas", pessoa);
}

export async function guardarCandidatura(
  vagaId: string,
  candidatura: { nome: string; email: string; habilidades: string[]; pessoaId: string },
) {
  return gravar<Candidatura>("POST", `/vagas/${encodeURIComponent(vagaId)}/candidaturas`, candidatura);
}

export async function listarCandidaturasDe(pessoaId: string): Promise<CandidaturaComVaga[]> {
  return (
    (await ler<CandidaturaComVaga[]>(
      `/pessoas/${encodeURIComponent(pessoaId)}/candidaturas`,
      "candidaturas",
    )) ?? []
  );
}

export async function contarCandidaturas(vagaId: string): Promise<number> {
  const lista = await ler<Candidatura[]>(
    `/vagas/${encodeURIComponent(vagaId)}/candidaturas`,
    "candidaturas",
  );
  return lista?.length ?? 0;
}

/* ─── FRENTE 4 · NÚMEROS E ARQUIVAR ─────────────────────────────────────── */

/** A API conta e devolve números: nenhuma vaga atravessa a rede para virar um total. */
export async function buscarNumeros(): Promise<Numeros> {
  const numeros = await ler<Numeros>("/numeros", "vagas");
  if (!numeros) throw new Error("GET /numeros respondeu 404");
  return numeros;
}

/** PATCH, e não PUT: só um campo muda. */
export async function arquivarVaga(id: string) {
  return gravar<Vaga>("PATCH", `/vagas/${encodeURIComponent(id)}`, { arquivada: true });
}

/* ─── O LOGIN ─────────────────────────────────────────────────────────────
   Quem confere a senha é a API: o site pergunta "confere?", e nunca vê o hash. */

export async function conferirLogin(email: string, senha: string): Promise<Pessoa | null> {
  const gravou = await gravar<Pessoa>("POST", "/sessoes", { email, senha });
  return gravou.ok ? gravou.dado : null;
}

/** Sem cache: o papel de alguém pode mudar. */
export async function buscarPessoa(id: string): Promise<Pessoa | null> {
  const resposta = await fetch(`${API}/pessoas/${encodeURIComponent(id)}`, { cache: "no-store" });
  if (resposta.status === 404) return null;
  if (!resposta.ok) throw new Error(`GET /pessoas/${id} respondeu ${resposta.status}`);
  return resposta.json();
}