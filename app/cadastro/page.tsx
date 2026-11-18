import Link from "next/link";
import FormularioDeCadastro from "./formulario"; // Aqui chamamos o arquivo que refatoramos!

export default function PaginaDeCadastro() {
  return (
    <main className="container">
      <h2>Criar Conta</h2>
      <p>Crie uma conta para se candidatar às vagas disponíveis.</p>

      {/* Trocamos todo aquele form antigo por uma linha só */}
      <FormularioDeCadastro />

      <div style={{ marginTop: "2rem" }}>
        Já tem uma conta? <Link href="/entrar">Faça login aqui</Link>.
      </div>
    </main>
  );
}