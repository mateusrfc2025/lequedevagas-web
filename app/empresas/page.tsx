import type { Metadata } from "next";
import { listarEmpresas } from "@/lib/api";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Empresas | Leque de Vagas",
  description: "Empresas com oportunidades de início de carreira.",
};

export default async function paginaEmpresas() {
  const empresas = await listarEmpresas();

    return (
        <section>
            <h1>Empresas</h1>

            {empresas.map((empresa) => (
                <article key={empresa.slug}>
                    <h2>{empresa.nome}</h2>

                    <p>{empresa.sobre}</p>

                    <Link href={`/empresas/${empresa.slug}`}>
                    Ver empresa
                    </Link>
                </article>
            ))}
        </section>
    );
}