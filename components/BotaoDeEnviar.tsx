"use client";

import type { ComponentProps } from "react";
import { useFormStatus } from "react-dom";
import Botao from "@/components/ui/Botao";

export default function BotaoDeEnviar({
  children,
  enviando = "Enviando…",
  variante,
}: {
  children: React.ReactNode;
  enviando?: string;
  variante?: ComponentProps<typeof Botao>["variante"];
}) {
  const { pending } = useFormStatus();
  return (
    <Botao type="submit" variante={variante} disabled={pending}>
      {pending ? enviando : children}
    </Botao>
  );
}
