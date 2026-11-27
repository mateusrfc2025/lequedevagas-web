
import { buscarNumeros } from "@/lib/api";

export default async function NumerosDoCatalogo() {
  // A API devolve os números prontos, sem trazer todas as vagas.
  const numeros = await buscarNumeros();

  return (
    <p className="numeros">
      {numeros.total} vagas abertas · {numeros.aceitamIniciante} aceitam quem está começando
    </p>
  );
}
