"use client";
import { useActionState } from "react";
import { criarVaga, type Estado } from "./acoes";
import BotaoDeEnviar from "@/components/BotaoDeEnviar";
const INICIAL: Estado = { ok: false, erros: {} };

export default function FormularioDeVaga() {
  const [estado, acaoDoForm, pendente] = useActionState(criarVaga, INICIAL);

  return (
    <form action={acaoDoForm} className="form">
      <label>
        Título
        <input name="titulo" />
      </label>
      {estado.erros.titulo && <p className="erro">{estado.erros.titulo}</p>}

      <label>
        Empresa (slug)
        <input name="empresaSlug" />
      </label>
      {estado.erros.empresaSlug && <p className="erro">{estado.erros.empresaSlug}</p>}

      <label>
        Local
        <input name="local" />
      </label>
      {estado.erros.local && <p className="erro">{estado.erros.local}</p>}

      <label>
        <input type="checkbox" name="aceitaIniciante" />
        Aceita iniciante
      </label>

      <label>
        Vagas
        <input type="number" name="vagas" />
      </label>
      {estado.erros.vagas && <p className="erro">{estado.erros.vagas}</p>}

        <BotaoDeEnviar>Publicar</BotaoDeEnviar>
    </form>
  );
}