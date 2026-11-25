
// Sem "use client": quem importa este arquivo já é de cliente.
 // A linha marca a porta, não cada móvel da casa.

export default function Filtros({
  busca,
  aoMudarBusca,
  area,
  aoMudarArea,
  areas,
}: {
  busca: string;
  // o tipo de uma função: recebe texto, não devolve nada
  aoMudarBusca: (valor: string) => void;
  area: string;
  aoMudarArea: (valor: string) => void;
  areas: string[];
}) {
  // Nenhum useState aqui. Este componente não lembra de nada: ele mostra o
  // que recebe e avisa quando alguém mexe.
  return (
    <div className="my-4 grid gap-3">
      <label className="sr-only" htmlFor="busca">
        Buscar vaga
      </label>
      <input
        id="busca"
        type="search"
        placeholder="Buscar por título ou empresa"
        value={busca}
        className="rounded-[10px] border border-borda-campo bg-superficie px-3 py-2 text-principal"
        // sem este onChange o campo não deixa digitar
        onChange={(e) => aoMudarBusca(e.target.value)}
      />

      <div className="flex flex-wrap gap-2">
        {areas.map((nome) => (
          <button
            key={nome}
            type="button"
            className="inline-flex items-center gap-1.5 rounded-full border border-borda bg-transparent px-3 py-1.5 text-suave aria-pressed:border-principal aria-pressed:text-principal"
            aria-pressed={nome === area}
            onClick={() => aoMudarArea(nome)}
          >
            {nome}
          </button>
        ))}
      </div>
    </div>
  );
}
