import type { ComponentProps } from "react";

const VARIANTES = {
  primario: "bg-principal text-fundo hover:opacity-90",
  secundario: "border border-borda-campo text-principal hover:bg-superficie",
  perigo: "border border-erro text-erro hover:bg-erro hover:text-fundo",
};

type Props = ComponentProps<"button"> & {
  variante?: keyof typeof VARIANTES;
};

export default function Botao({
  variante = "primario",
  type = "button",
  className = "",
  ...props
}: Props) {
  return (
    <button
      type={type}
      className={`inline-flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTES[variante]} ${className}`}
      {...props}
    />
  );
}
