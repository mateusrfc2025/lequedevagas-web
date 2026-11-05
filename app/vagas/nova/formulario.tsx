"use client";

import { useActionState } from "react";
import { criarVaga } from "./acoes";
import BotaoDeEnviar from "@/components/BotaoDeEnviar";
import Campo from "@/components/ui/Campo";
import Selecao from "@/components/ui/Selecao";
import AreaDeTexto from "@/components/ui/AreaDeTexto";
import { EstadoInicial } from "@/lib/tipos";

export default function FormularioDeVaga() {
  const [estado, acaoDoForm] = useActionState(criarVaga, EstadoInicial);
  const { valores: v, erros } = estado;

  return (
    <form action={acaoDoForm} className="grid max-w-xl gap-4" noValidate>
      <Campo rotulo="Título" name="titulo" defaultValue={v.titulo} erro={erros.titulo} />

      <Selecao rotulo="Área" name="area" defaultValue={v.area ?? ""} erro={erros.area}>
        <option value="">Selecione a área</option>
        <option value="Front-end">Front-end</option>
        <option value="Back-end">Back-end</option>
        <option value="Mobile">Mobile</option>
        <option value="Dados">Dados</option>
        <option value="Design">Design</option>
        <option value="QA">QA</option>
      </Selecao>

      <Selecao rotulo="Senioridade" name="senioridade" defaultValue={v.senioridade ?? ""} erro={erros.senioridade}>
        <option value="">Selecione a senioridade</option>
        <option value="Estágio">Estágio</option>
        <option value="Júnior">Júnior</option>
        <option value="Pleno">Pleno</option>
        <option value="Sênior">Sênior</option>
      </Selecao>

      <Campo rotulo="Local" name="local" defaultValue={v.local} erro={erros.local} />

      <AreaDeTexto rotulo="Descrição da vaga" name="descricao" defaultValue={v.descricao} erro={erros.descricao} />

      <label className="flex w-fit items-center gap-2">
        <input
          type="checkbox"
          name="aceitaIniciante"
          defaultChecked={v.aceitaIniciante === "on"}
          className="size-4 accent-principal"
        />
        Aceita quem está começando
      </label>

      <div>
        <BotaoDeEnviar>Publicar</BotaoDeEnviar>
      </div>

      {estado.mensagem && (
        <p role="alert" className="m-0 text-sm text-erro">
          {estado.mensagem}
        </p>
      )}
    </form>
  );
}
