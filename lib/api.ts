import { Vaga } from "./tipos";

export default async function listarVagas() {
  const resposta = await fetch("https://.../dados/vagas.json");
  const vagas: Vaga[] = await resposta.json();

  return vagas
}