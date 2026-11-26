"use client";

import { useActionState } from "react";
import BotaoDeEnviar from "@/components/BotaoDeEnviar";
import Campo from "@/components/ui/Campo";
import { cadastrar } from "./acoes";
import { EstadoInicial } from "@/lib/tipos";

export default function FormularioDeCadastro() {
  const [estado, acaoDoForm] = useActionState(cadastrar, EstadoInicial);

  return (
    <form className="formulario" action={acaoDoForm}>
      <Campo
        rotulo="Nome"
        name="nome"
        type="text"
        autoComplete="name"
        defaultValue={estado.valores?.nome as string}
        erro={estado.erros?.nome}
      />

      <Campo
        rotulo="E-mail"
        name="email"
        type="email"
        autoComplete="email"
        defaultValue={estado.valores?.email as string}
        erro={estado.erros?.email}
      />

      <Campo
        rotulo="Senha"
        name="senha"
        type="password"
        autoComplete="new-password"
        defaultValue={estado.valores?.senha as string}
        erro={estado.erros?.senha}
      />

      {estado.erros?.geral && <p className="erro">{estado.erros.geral}</p>}

      <BotaoDeEnviar>Cadastrar e Entrar</BotaoDeEnviar>
    </form>
  );
}