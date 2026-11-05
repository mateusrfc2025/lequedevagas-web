import Link from "next/link";
import FormularioDeVaga from "./formulario";
import { buscarEmpresa } from "@/lib/api";
import { usuarioAtual } from "@/lib/sessao";
import { podePublicar } from "@/lib/permissoes";

export default async function NovaVaga() {
  const quem = await usuarioAtual();

  if (!podePublicar(quem)) {
    return (
      <section>
        <h1>Publicar uma vaga</h1>
        <p>Só quem publica por uma empresa pode abrir vaga.</p>
        <p>
          <Link href="/entrar">Entrar</Link>
        </p>
      </section>
    );
  }

  const empresa = await buscarEmpresa(quem.empresaSlug);

  return (
    <section>
      <h1>Publicar uma vaga</h1>
      <p>
        Publicando pela <strong>{empresa?.nome ?? quem.empresaSlug}</strong>.
      </p>
      <FormularioDeVaga />
    </section>
  );
}
