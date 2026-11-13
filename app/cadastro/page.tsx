import type { Metadata } from "next";
import Link from "next/link";
import FormularioDeCadastro from "./formulario";

export const metadata: Metadata = { title: "Criar conta · Leque de Vagas" };

export default function Cadastro() {
  return (
    <section>
      <h1>Criar conta</h1>
      <FormularioDeCadastro />
      <p className="text-sm text-suave">
        Já tem conta? <Link href="/entrar">Entrar</Link>
      </p>
    </section>
  );
}