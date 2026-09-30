import { listarVagas } from "@/lib/api";
import MuralDeVagas from "@/components/MuralDeVagas";

// Servidor busca; o MuralDeVagas (cliente) cuida dos filtros.
export default async function ListagemDeVagas() {
  const vagas = await listarVagas();
  return <MuralDeVagas vagas={vagas} />;
}