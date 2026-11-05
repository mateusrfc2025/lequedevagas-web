import type { Metadata } from "next";
import FormularioDeEntrada from "./formulario";

export const metadata: Metadata = { title: "Entrar · Leque de Vagas" };

export default function Entrar() {
  return (
    <section>
      <h1>Entrar</h1>
      <FormularioDeEntrada />
    </section>
  );
}
