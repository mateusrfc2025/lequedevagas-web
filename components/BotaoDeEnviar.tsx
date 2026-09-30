"use client";
import { useFormStatus } from "react-dom";

export default function BotaoDeEnviar({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Enviando…" : children}
    </button>
  );
}