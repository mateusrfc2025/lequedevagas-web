import FormularioDeVaga from "./formulario";
import { listarEmpresas } from "@/lib/api";

export default async function NovaVaga() {
  const empresas = await listarEmpresas();
  return (
    <section>
      <h1>Publicar uma vaga</h1>
      <FormularioDeVaga empresas={empresas} />
    </section>
  );
}