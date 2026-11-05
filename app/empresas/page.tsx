import type { Metadata } from "next";
import Link from "next/link";
import { listarEmpresas, listarVagas } from "@/lib/api";

export const metadata: Metadata = {
  title: "Empresas | Leque de Vagas",
  description: "Empresas com oportunidades de início de carreira.",
};

export default async function PaginaEmpresas() {
  const [empresas, vagas] = await Promise.all([listarEmpresas(), listarVagas()]);

  return (
    <section>
      <h1>Empresas</h1>

      <ul className="grid gap-3">
        {empresas.map((empresa) => {
          const quantas = vagas.filter((v) => v.empresaSlug === empresa.slug).length;

          return (
            <li
              key={empresa.slug}
              className="rounded-xl border border-borda transition-colors hover:border-borda-campo"
            >
              <Link href={`/empresas/${empresa.slug}`} className="block px-4 py-3.5 no-underline">
                <span className="font-semibold">{empresa.nome}</span>
                <span className="block text-sm text-suave">
                  {quantas === 1 ? "1 vaga aberta" : `${quantas} vagas abertas`}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
