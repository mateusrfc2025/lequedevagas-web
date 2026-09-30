import { Suspense } from "react";
import NumerosDoCatalogo from "@/components/NumerosDoCatalogo";
import ListagemDeVagas from "@/components/ListagemDeVagas";

export default function Vagas() {
  return (
    <>
      <h1>Vagas</h1>

      {/* fallback com a MESMA altura do bloco real, para a tela não pular */}
      <Suspense fallback={<div className="skeleton" style={{ height: 24 }} />}>
        <NumerosDoCatalogo />
      </Suspense>

      <Suspense
        fallback={
          <ul className="lista">
            {[1, 2, 3, 4].map((n) => (
              <li key={n} className="skeleton" />
            ))}
          </ul>
        }
      >
        <ListagemDeVagas />
      </Suspense>
    </>
  );
}