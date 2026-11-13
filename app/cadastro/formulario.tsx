"use client";

import { useActionState } from "react";
import { cadastrar } from "./acoes";
import BotaoDeEnviar from "@/components/BotaoDeEnviar";
import Campo from "@/components/ui/Campo";
import { EstadoInicial } from "@/lib/tipos";

export default function FormularioDeCadastro() {
  const [estado, acaoDoForm] = useActionState(cadastrar, EstadoInicial);
  const { valores, erros } = estado;

  return (
    <form action={acaoDoForm} className="grid max-w-sm gap-4" noValidate>
      <Campo rotulo="Nome" name="nome" autoComplete="name" defaultValue={valores.nome} erro={erros.nome} />
      <Campo rotulo="E-mail" name="email" type="email" autoComplete="email" defaultValue={valores.email} erro={erros.email} />
      <Campo rotulo="Senha" name="senha" type="password" autoComplete="new-password" erro={erros.senha} />
      <div>
        <BotaoDeEnviar enviando="Criando…">Criar conta</BotaoDeEnviar>
      </div>
      {estado.mensagem && (
        <p role="alert" className="m-0 text-sm text-erro">
          {estado.mensagem}
        </p>
      )}
    </form>
  );
}