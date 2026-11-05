import { useId, type ComponentProps } from "react";

type Props = ComponentProps<"select"> & {
  rotulo: string;
  erro?: string;
};

export default function Selecao({ rotulo, erro, className = "", children, ...props }: Props) {
  const id = useId();
  const idDoErro = `${id}-erro`;

  return (
    <div className="grid gap-1">
      <label htmlFor={id} className="text-sm text-suave">
        {rotulo}
      </label>
      <select
        id={id}
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro ? idDoErro : undefined}
        className={`rounded-lg border border-borda-campo bg-superficie px-3 py-2.5 aria-[invalid=true]:border-erro ${className}`}
        {...props}
      >
        {children}
      </select>
      {erro && (
        <p id={idDoErro} className="m-0 text-sm text-erro">
          {erro}
        </p>
      )}
    </div>
  );
}
