import { Vaga } from "./tipos";

export default async function listarVagas() {
  const resposta = await fetch("https://raw.githubusercontent.com/mateusrfc2025/lequedevagas-web/refs/heads/main/dados/vagas.json");
  const vagas: Vaga[] = await resposta.json();

  return vagas
}