import { listarVagas } from "@/lib/api";

// Componente de SERVIDOR que busca por conta própria.
export default async function NumerosDoCatalogo() {
  const vagas = await listarVagas();
  const iniciantes = vagas.filter((v) => v.aceitaIniciante).length;

  return (
    <p className="numeros" style={{ minHeight: 24 }}>
      <strong>{vagas.length}</strong> vagas · <strong>{iniciantes}</strong>{" "}
      aceitam quem está começando
    </p>
  );
}