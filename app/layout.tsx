import type { Metadata } from "next";
import Cabecalho from "@/components/Cabecalho";
import "./globals.css";

export const metadata: Metadata = {
  title: "Leque de Vagas",
  description: "Vagas de tecnologia para quem está migrando de carreira",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-fundo font-sans leading-[1.6] text-principal">
        <Cabecalho />
        <main className="mx-auto max-w-180 px-4 py-8">{children}</main>
        <footer className="border-t border-borda p-4 text-suave">
          Leque de Vagas · 2026
        </footer>
      </body>
    </html>
  );
}
