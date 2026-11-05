"use client";

import { useActionState } from "react";
import { salvarEmpresa } from "./acoes";
import BotaoDeEnviar from "@/components/BotaoDeEnviar";
import Campo from "@/components/ui/Campo";
import AreaDeTexto from "@/components/ui/AreaDeTexto";
import { EstadoInicial } from "@/lib/tipos";
import type { Empresa } from "@/lib/tipos";

export default function FormularioDaEmpresa({ empresa }: { empresa: Empresa }) {
  const acaoComSlug = salvarEmpresa.bind(null, empresa.slug);
  const [estado, acaoDoForm] = useActionState(acaoComSlug, EstadoInicial);
  const { valores, erros } = estado;

  return (
    <form action={acaoDoForm} className="grid max-w-xl gap-4" noValidate>
      <Campo rotulo="Nome" name="nome" defaultValue={valores.nome ?? empresa.nome} erro={erros.nome} />
      <AreaDeTexto rotulo="Sobre" name="sobre" defaultValue={valores.sobre ?? empresa.sobre} erro={erros.sobre} />
      <Campo rotulo="Site" name="site" type="url" defaultValue={valores.site ?? empresa.site} erro={erros.site} />
      <div>
        <BotaoDeEnviar>Salvar</BotaoDeEnviar>
      </div>
      {estado.mensagem && (
        <p role="status" className={`m-0 text-sm ${estado.ok ? "text-sucesso" : "text-erro"}`}>
          {estado.mensagem}
        </p>
      )}
    </form>
  );
}
