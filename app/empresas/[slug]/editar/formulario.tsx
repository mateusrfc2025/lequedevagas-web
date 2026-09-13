"use client";

import { useActionState } from "react";
import { salvarEmpresa } from "./acoes";
import BotaoDeEnviar from "@/components/BotaoDeEnviar";
import { EstadoInicial } from "@/lib/tipos";
import type { Empresa } from "@/lib/tipos";

export default function FormularioDaEmpresa({ empresa }: { empresa: Empresa }) {

  const acaoComSlug = salvarEmpresa.bind(null, empresa.slug);

  const [estado, acaoDoForm] = useActionState(acaoComSlug, EstadoInicial);

  return (
    <form action={acaoDoForm} className="form">

      <label>
        Nome
        <input name="nome" defaultValue={estado.valores.nome ?? empresa.nome} />
      </label>
      {estado.erros.nome && <p className="erro">{estado.erros.nome}</p>}

      <label>
        Sobre
        <textarea name="sobre" defaultValue={estado.valores.sobre ?? empresa.sobre} />
      </label>
      {estado.erros.sobre && <p className="erro">{estado.erros.sobre}</p>}

      <BotaoDeEnviar>Salvar</BotaoDeEnviar>

      {estado.mensagem && (
        <p role="status" className={estado.ok ? "ok" : "erro"}>{estado.mensagem}</p>
      )}
    </form>
  );
}