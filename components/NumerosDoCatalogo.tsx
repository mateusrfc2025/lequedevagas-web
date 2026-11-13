import { buscarNumeros } from "@/lib/api";

export default async function NumerosDoCatalogo() {
  // A API conta: nenhuma vaga atravessa a rede para virar um total.
  const numeros = await buscarNumeros();
  return (
    <p className="numeros" style={{ minHeight: 24 }}>
      <strong>{numeros.total}</strong> vagas abertas · <strong>{numeros.aceitamIniciante}</strong>{" "}
      aceitam quem está começando
    </p>
  );
}