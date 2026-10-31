import { listarVagas } from "@/lib/api";

export async function GET() {
  const vagas = await listarVagas();

  return Response.json(vagas);
}