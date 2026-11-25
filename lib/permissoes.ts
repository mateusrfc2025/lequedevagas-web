import type { Quem } from "@/lib/sessao";

/** Publicar vaga: só quem fala por uma empresa. (frente 1) */
export function podePublicar(
  quem: Quem | null,
): quem is Quem & { empresaSlug: string } {
  return quem?.papel === "empresa" && typeof quem.empresaSlug === "string";
}

/** Editar o perfil de uma empresa: só quem fala por ELA. (frente 2) */
export function podeEditarEmpresa(quem: Quem | null, slug: string): boolean {
  return quem?.papel === "empresa" && quem.empresaSlug === slug;
}


/** Arquivar vaga: só quem publicou pode arquivar. (frente 4) */
export function podeArquivar(
  quem: Quem | null,
  vaga: { autorId: string | null } | null,
): boolean {
  return (
    quem?.papel === "empresa" &&
    vaga !== null &&
    vaga.autorId === quem.id
  );
}

