import { criarVaga } from "./acoes";

export default function NovaVaga() {
  return (
    <form action={criarVaga}>
      <label>
        Título
        <input name="titulo" />
      </label>

      <label>
        Empresa (slug)
        <input name="empresaSlug" />
      </label>

      <label>
        Local
        <input name="local" />
      </label>

      <label>
        <input type="checkbox" name="aceitaIniciante" />
        Aceita iniciante
      </label>

      <label>
        Vagas
        <input type="number" name="vagas" />
      </label>

      <button>Publicar</button>
    </form>
  );
}