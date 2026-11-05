import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { usuarioAtual, type Quem } from "@/lib/sessao";
import { buscarEmpresa, listarVagasDoAutor } from "@/lib/api";
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

      {quem.papel === "empresa" ? (
        <PainelDaEmpresa quem={quem} />
      ) : (
        <PainelDaCandidata />
      )}

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
          Nenhuma vaga publicada por você.{" "}
          <Link href="/vagas/nova">Publicar a primeira</Link>
        </p>
      ) : (
        <ul className="grid gap-3">
          {vagas.map((vaga) => (
            <li
              key={vaga.id}
              className={`${CARTAO} flex flex-wrap items-center justify-between gap-2 pr-4`}
            >
              <Link href={`/vagas/${vaga.id}`} className={LINK_DO_CARTAO}>
                <span className="font-semibold">{vaga.titulo}</span>
                <span className="block text-sm text-suave">
                  {vaga._count.candidaturas === 1
                    ? "1 candidatura"
                    : `${vaga._count.candidaturas} candidaturas`}
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

function PainelDaCandidata() {
  return (
    <>
      <h2>Suas candidaturas</h2>
      <p>
        Em breve. <Link href="/vagas">Ver as vagas</Link>
      </p>
    </>
  );
}
