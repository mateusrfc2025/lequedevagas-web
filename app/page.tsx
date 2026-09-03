import Link from "next/link";
import { empresas } from "@/data/empresas";
import listarVagas from "@/lib/api";

export default async function Home() {
  const vagas = await listarVagas();

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
