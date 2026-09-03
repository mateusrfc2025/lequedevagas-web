import MuralDeVagas from "@/components/MuralDeVagas";
import listarVagas from "@/lib/api";

export default async function Vagas() {
  const vagas = await listarVagas();

  return (
    <>
      <h1>Vagas</h1>
      {/* A página busca o dado e entrega pronto. Quem cuida do que muda é o
          mural — e só ele desce para o navegador. */}
      <MuralDeVagas vagas={vagas} />
    </>
  );
}
