"use client";
import { useActionState } from "react";
import { criarVaga } from "./acoes";
import type { Estado } from "@/lib/tipos";
import BotaoDeEnviar from "@/components/BotaoDeEnviar";
import { Empresa } from "@/lib/tipos";

// nao estao sendo usados tambem
//import { EstadoInicial } from "@/lib/tipos";
//import type { Empresa } from "@/lib/tipos";

const INICIAL: Estado = { ok: false, erros: {}, valores: {} };

export default function FormularioDeVaga({ empresas }: { empresas: Empresa[] }) {
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
                {/* <select>, e não campo de texto: assim ninguém digita um slug
            que não existe. A validação do passo 2 da ação continua sendo
            necessária — mas agora ela é a rede, não a porta. */}
        <select name="empresaSlug" defaultValue={estado.valores.empresaSlug ?? ""}>
          <option value="">Escolha…</option>
          {empresas.map((e) => (
            <option key={e.slug} value={e.slug}>{e.nome}</option>
          ))}
        </select>
      </label>
      {estado.erros.empresaSlug && <p className="erro">{estado.erros.empresaSlug}</p>}

      <label>
        Área
        <select name="area" defaultValue="">
          <option value="" disabled>Selecione a área</option>
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
        <select name="senioridade" defaultValue="">
          <option value="" disabled>Selecione a senioridade</option>
          <option value="Estágio">Estágio</option>
          <option value="Júnior">Júnior</option>
          <option value="Pleno">Pleno</option>
          <option value="Sênior">Sênior</option>
        </select>
      </label>
      {estado.erros.senioridade && <p className="erro">{estado.erros.senioridade}</p>}

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
        Descrição da vaga
        <textarea name="descricao" rows={5} />
      </label>
      {estado.erros.descricao && <p className="erro">{estado.erros.descricao}</p>}

      <label>
        Vagas
        <input type="number" name="vagas" />
      </label>
      {estado.erros.vagas && <p className="erro">{estado.erros.vagas}</p>}

        <BotaoDeEnviar>Publicar</BotaoDeEnviar>
    </form>
  );
}