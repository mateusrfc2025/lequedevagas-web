"use client";

import { useActionState } from "react";
import Link from "next/link";
import BotaoDeEnviar from "@/components/BotaoDeEnviar";
import { entrar } from "./acoes";
import { EstadoInicial } from "@/lib/tipos";

export default function PaginaDeLogin() {
  const [estado, acaoDoForm] = useActionState(entrar, EstadoInicial);

  return (
    <main className="container">
      <h2>Entrar</h2>
      <p>Faça login para gerenciar suas candidaturas e acessar sua conta.</p>

      <form className="formulario" action={acaoDoForm}>
        <label>
          E-mail
          <input
            name="email"
            type="email"
            defaultValue={estado.valores?.email}
          />
        </label>
        {estado.erros?.email && <p className="erro">{estado.erros.email}</p>}

        <label>
          Senha
          <input
            name="senha"
            type="password"
            defaultValue={estado.valores?.senha}
          />
        </label>
        {estado.erros?.senha && <p className="erro">{estado.erros.senha}</p>}

        {estado.erros?.geral && <p className="erro">{estado.erros.geral}</p>}

        <BotaoDeEnviar>Entrar</BotaoDeEnviar>
      </form>

      <div style={{ marginTop: "2rem" }}>
        Ainda não tem conta? <Link href="/cadastro">Cadastre-se aqui</Link>.
      </div>
    </main>
  );
}
