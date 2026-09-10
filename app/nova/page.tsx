import { criarVaga } from "./acoes";

export default function NovaVaga() {
    return (
        <form action={criarVaga}>        
        <input name="titulo" />
        <input name="empresaSlug" />
        <input name="local" />
        <input name="aceitaIniciante" type="checkbox" />
        <input name="vagas" type="number" />
        <button>Publicar</button>
      </form>
    );
}