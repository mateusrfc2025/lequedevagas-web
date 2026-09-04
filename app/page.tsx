import Link from "next/link";
import listarVagas, { listarEmpresas } from "@/lib/api";

export default async function Home() {
  const vagas = await listarVagas();
  const empresas = await listarEmpresas();
  // Duas contas no servidor. Números que a página não precisa lembrar,
  // só mostrar — então não são estado, são conta.
  const paraIniciante = vagas.filter((v) => v.aceitaIniciante).length;

  return (
    <section>
      <h1>Vagas de tecnologia para quem está migrando</h1>
      <p>
        O Leque de Vagas reúne oportunidades de início de carreira em times
        que aceitam quem está começando. São {vagas.length} vagas abertas de{" "}
        {empresas.length} empresas, e {paraIniciante} delas não exigem
        experiência anterior.
      </p>

      <p>
        <Link href="/vagas">Ver as vagas abertas →</Link>
      </p>
    </section>
  );
}
