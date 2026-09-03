import type { Metadata } from "next";

// A metadata da página sobrescreve a do layout.
export const metadata: Metadata = {
  title: "Sobre · Leque de Vagas",
};

export default function Sobre() {
  return (
    <section>
      <h1>Sobre o projeto</h1>
      <p>
        Este é o projeto de referência do curso Introdução ao Next.js. Ele
        cresce junto com as aulas: a cada semana entra o recurso que foi
        ensinado, e nada além dele.
      </p>
      <p>
        Nesta versão os dados moram dentro do próprio repositório, em{" "}
        <code>data/vagas.ts</code>. Na aula 04 eles passam a vir de fora, e é
        aí que aparece uma coisa que o projeto ainda não tem: a espera.
      </p>
    </section>
  );
}
