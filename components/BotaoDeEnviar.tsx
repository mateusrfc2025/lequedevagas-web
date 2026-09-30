"use client";
import { useFormStatus } from "react-dom";

export default function BotaoDeEnviar({
  children,
  enviando = "Enviando…",
}: {
  children: React.ReactNode;
  enviando?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? enviando : children}
    </button>
  );
}