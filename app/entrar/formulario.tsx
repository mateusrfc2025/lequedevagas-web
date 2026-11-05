"use client";

import { useActionState } from "react";
import { entrar } from "./acoes";
import BotaoDeEnviar from "@/components/BotaoDeEnviar";
import Campo from "@/components/ui/Campo";
import { EstadoInicial } from "@/lib/tipos";

export default function FormularioDeEntrada() {
  const [estado, acaoDoForm] = useActionState(entrar, EstadoInicial);
  const { valores, erros } = estado;

  return (
    <form action={acaoDoForm} className="grid max-w-sm gap-4" noValidate>
      <Campo rotulo="E-mail" name="email" type="email" autoComplete="email" defaultValue={valores.email} erro={erros.email} />
      <Campo rotulo="Senha" name="senha" type="password" autoComplete="current-password" erro={erros.senha} />
      <div>
        <BotaoDeEnviar enviando="Entrando…">Entrar</BotaoDeEnviar>
      </div>
      {estado.mensagem && (
        <p role="alert" className="m-0 text-sm text-erro">
          {estado.mensagem}
        </p>
      )}
    </form>
  );
}
