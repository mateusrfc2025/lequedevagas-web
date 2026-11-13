import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { usuarioAtual, type Quem } from "@/lib/sessao";
import {
  buscarEmpresa,
  contarCandidaturas,
  listarCandidaturasDe,
  listarVagasDoAutor,
} from "@/lib/api";
import BotaoDeEnviar from "@/components/BotaoDeEnviar";
import { sair } from "./acoes";
import { arquivar } from "@/app/vagas/acoes";

export const metadata: Metadata = { title: "Minha área · Leque de Vagas" };

const CARTAO = "rounded-xl border border-borda transition-colors hover:border-borda-campo";
const LINK_DO_CARTAO = "block px-4 py-3.5 no-underline";

export default async function Painel() {
  const quem = await usuarioAtual();
  if (!quem) redirect("/entrar");

  return (
    <section>
      <h1>Olá, {quem.nome}</h1>

      {quem.papel === "empresa" ? <PainelDaEmpresa quem={quem} /> : <PainelDaCandidata quem={quem} />}

      <form action={sair} className="mt-8">
        <BotaoDeEnviar variante="secundario" enviando="Saindo…">
          Sair
        </BotaoDeEnviar>
      </form>
    </section>
  );
}

async function PainelDaEmpresa({ quem }: { quem: Quem }) {
  const [empresa, vagas] = await Promise.all([
    quem.empresaSlug ? buscarEmpresa(quem.empresaSlug) : undefined,
    listarVagasDoAutor(quem.id),
  ]);
  // A API não manda o _count: um pedido por vaga (o painel tem poucas).
  const contagens = await Promise.all(vagas.map((vaga) => contarCandidaturas(vaga.id)));

  return (
    <>
      <p className="text-sm text-suave">
        Você publica pela {empresa?.nome ?? quem.empresaSlug} ·{" "}
        <Link href={`/empresas/${quem.empresaSlug}/editar`} className="text-principal">
          editar o perfil
        </Link>
      </p>

      <h2>Suas vagas</h2>
      {vagas.length === 0 ? (
        <p>
          Nenhuma vaga publicada por você. <Link href="/vagas/nova">Publicar a primeira</Link>
        </p>
      ) : (
        <ul className="grid gap-3">
          {vagas.map((vaga, i) => (
            <li key={vaga.id} className={`${CARTAO} flex flex-wrap items-center justify-between gap-2 pr-4`}>
              <Link href={`/vagas/${vaga.id}`} className={LINK_DO_CARTAO}>
                <span className="font-semibold">{vaga.titulo}</span>
                <span className="block text-sm text-suave">
                  {contagens[i] === 1 ? "1 candidatura" : `${contagens[i]} candidaturas`}
                </span>
              </Link>

              <form action={arquivar} className="pb-3.5 sm:pb-0">
                <input type="hidden" name="id" value={vaga.id} />
                <BotaoDeEnviar variante="perigo" enviando="Arquivando…">
                  Arquivar
                </BotaoDeEnviar>
              </form>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

async function PainelDaCandidata({ quem }: { quem: Quem }) {
  const candidaturas = await listarCandidaturasDe(quem.id);

  return (
    <>
      <h2>Suas candidaturas</h2>
      {candidaturas.length === 0 ? (
        <p>
          Você ainda não se candidatou. <Link href="/vagas">Ver as vagas</Link>
        </p>
      ) : (
        <ul className="grid gap-3">
          {candidaturas.map((c) => (
            <li key={c.id} className={`${CARTAO} px-4 py-3.5`}>
              {/* c.vaga pode ser null: a vaga foi apagada */}
              {c.vaga ? (
                <Link href={`/vagas/${c.vaga.id}`} className="font-semibold">
                  {c.vaga.titulo}
                </Link>
              ) : (
                <span className="font-semibold">Vaga removida</span>
              )}
              <span className="block text-sm text-suave">
                {c.vaga?.empresa} · enviada em {new Date(c.enviadaEm).toLocaleDateString("pt-BR")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}