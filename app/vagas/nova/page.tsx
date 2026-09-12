"use client";

import { useActionState, useEffect, useState } from "react";
import { criarVaga } from "./acoes";
import { listarEmpresas } from "@/lib/api";
import type { Empresa } from "@/lib/tipos";

type EstadoFormulario = {
  erros?: Record<string, string[]>;
  sucesso?: boolean;
} | null;

export default function NovaVagaPage() {
  const [estado, formAction, isPending] = useActionState<EstadoFormulario, FormData>(
    criarVaga,
    null
  );
  const [empresas, setEmpresas] = useState<Empresa[]>([]);

  useEffect(() => {
    listarEmpresas().then(setEmpresas).catch(console.error);
  }, []);

  return (
    <main className="max-w-2xl mx-auto p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Cadastrar Nova Vaga</h1>

      <form action={formAction} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Título da Vaga</label>
          <input 
            type="text" 
            name="titulo" 
            className="w-full p-2 rounded bg-zinc-900 border border-zinc-700 text-white" 
          />
          {estado?.erros?.titulo && (
            <p className="text-red-500 text-xs mt-1">{estado.erros.titulo[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Empresa</label>
          <select 
            name="empresaId" 
            className="w-full p-2 rounded bg-zinc-900 border border-zinc-700 text-white"
          >
            <option value="">Selecione uma empresa</option>
            {empresas.map((empresa) => (
              <option key={empresa.slug} value={empresa.slug}>
                {empresa.nome}
              </option>
            ))}
          </select>
          {estado?.erros?.empresaId && (
            <p className="text-red-500 text-xs mt-1">{estado.erros.empresaId[0]}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Área</label>
            <input 
              type="text" 
              name="area" 
              className="w-full p-2 rounded bg-zinc-900 border border-zinc-700 text-white" 
            />
            {estado?.erros?.area && (
              <p className="text-red-500 text-xs mt-1">{estado.erros.area[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Senioridade</label>
            <input 
              type="text" 
              name="senioridade" 
              className="w-full p-2 rounded bg-zinc-900 border border-zinc-700 text-white" 
            />
            {estado?.erros?.senioridade && (
              <p className="text-red-500 text-xs mt-1">{estado.erros.senioridade[0]}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Local</label>
          <input 
            type="text" 
            name="local" 
            className="w-full p-2 rounded bg-zinc-900 border border-zinc-700 text-white" 
          />
          {estado?.erros?.local && (
            <p className="text-red-500 text-xs mt-1">{estado.erros.local[0]}</p>
          )}
        </div>

        <div className="flex items-center gap-2 my-2">
          <input type="checkbox" name="aceitaIniciante" id="aceitaIniciante" className="w-4 h-4" />
          <label htmlFor="aceitaIniciante" className="text-sm">Aceita iniciantes?</label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descrição</label>
          <textarea 
            name="descricao" 
            rows={4} 
            className="w-full p-2 rounded bg-zinc-900 border border-zinc-700 text-white"
          ></textarea>
          {estado?.erros?.descricao && (
            <p className="text-red-500 text-xs mt-1">{estado.erros.descricao[0]}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="bg-blue-600 text-white font-medium p-2 rounded hover:bg-blue-700 disabled:opacity-50 mt-2"
        >
          {isPending ? "Publicando..." : "Publicar Vaga"}
        </button>
      </form>
    </main>
  );
}