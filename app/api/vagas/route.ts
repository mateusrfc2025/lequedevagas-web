import { listarVagas } from "@/lib/api";

// O nome da função É o método HTTP.
export async function GET() {
  const vagas = await listarVagas();
  return Response.json(vagas);
}