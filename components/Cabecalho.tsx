import MenuLink from "./MenuLink";

export default function Cabecalho() {
  return (
    <header className="flex flex-wrap items-center gap-4 border-b border-borda p-4">
      <strong>Leque de Vagas</strong>
      <nav aria-label="Principal" className="flex flex-wrap gap-3">
        <MenuLink href="/">Início</MenuLink>
        <MenuLink href="/vagas">Vagas</MenuLink>
        <MenuLink href="/vagas/nova">Publicar vaga</MenuLink>
        <MenuLink href="/empresas">Empresas</MenuLink>
        <MenuLink href="/sobre">Sobre</MenuLink>
        <MenuLink href="/termos">Termos</MenuLink>
        <MenuLink href="/painel">Minha área</MenuLink>
        <MenuLink href="/cadastro">Criar conta</MenuLink>
      </nav>
    </header>
  );
}