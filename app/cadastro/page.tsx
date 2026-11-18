"use client";

import { useActionState } from "react";
import BotaoDeEnviar from "@/components/BotaoDeEnviar";
import { criarConta } from "./acoes";
import { EstadoInicial } from "@/lib/tipos";
import Link from "next/link";

export default function PaginaDeCadastro() {
  const [estado, acaoDoForm] = useActionState(criarConta, EstadoInicial);

  return (
    <main className="container">
      <h2>Criar Conta</h2>
      <p>Crie uma conta para se candidatar às vagas disponíveis.</p>

      <form className="formulario" action={acaoDoForm}>
        <label>
          Nome
          <input
            name="nome"
            type="text"
            defaultValue={estado.valores?.nome}
          />
        </label>
        {estado.erros?.nome && <p className="erro">{estado.erros.nome}</p>}

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

        <BotaoDeEnviar>Cadastrar e Entrar</BotaoDeEnviar>
      </form>

      <div style={{ marginTop: "2rem" }}>
        Já tem uma conta? <Link href="/entrar">Faça login aqui</Link>.
      </div>
    </main>
  );
}