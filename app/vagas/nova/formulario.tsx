"use client";

import { useActionState } from "react";
import { criarVaga } from "./acoes";
import BotaoDeEnviar from "@/components/BotaoDeEnviar";
import { EstadoInicial } from "@/lib/tipos";
import type { Empresa } from "@/lib/tipos";

export default function FormularioDeVaga({ empresas }: { empresas: Empresa[] }) {
  const [estado, acaoDoForm] = useActionState(criarVaga, EstadoInicial);
  const v = estado.valores;

  return (
    <form action={acaoDoForm} className="form">
      <label>
        Título
        <input name="titulo" defaultValue={v.titulo} />
      </label>
      {estado.erros.titulo && <p className="erro">{estado.erros.titulo}</p>}

      <label>
        Empresa
        <select name="empresaSlug" defaultValue={v.empresaSlug ?? ""}>
          <option value="">Escolha…</option>
          {empresas.map((e) => (
            <option key={e.slug} value={e.slug}>{e.nome}</option>
          ))}
        </select>
      </label>
      {estado.erros.empresaSlug && <p className="erro">{estado.erros.empresaSlug}</p>}

      <label>
        Área
        <select name="area" defaultValue={v.area ?? ""}>
          <option value="">Selecione a área</option>
          <option value="Front-end">Front-end</option>
          <option value="Back-end">Back-end</option>
          <option value="Mobile">Mobile</option>
          <option value="Dados">Dados</option>
          <option value="Design">Design</option>
          <option value="QA">QA</option>
        </select>
      </label>
      {estado.erros.area && <p className="erro">{estado.erros.area}</p>}

      <label>
        Senioridade
        <select name="senioridade" defaultValue={v.senioridade ?? ""}>
          <option value="">Selecione a senioridade</option>
          <option value="Estágio">Estágio</option>
          <option value="Júnior">Júnior</option>
          <option value="Pleno">Pleno</option>
          <option value="Sênior">Sênior</option>
        </select>
      </label>
      {estado.erros.senioridade && <p className="erro">{estado.erros.senioridade}</p>}

      <label>
        Local
        <input name="local" defaultValue={v.local} />
      </label>
      {estado.erros.local && <p className="erro">{estado.erros.local}</p>}

      <label>
        <input
          type="checkbox"
          name="aceitaIniciante"
          defaultChecked={v.aceitaIniciante === "on"}
        />
        Aceita iniciante
      </label>

      <label>
        Descrição da vaga
        <textarea name="descricao" rows={5} defaultValue={v.descricao} />
      </label>
      {estado.erros.descricao && <p className="erro">{estado.erros.descricao}</p>}

      <BotaoDeEnviar>Publicar</BotaoDeEnviar>
    </form>
  );
}