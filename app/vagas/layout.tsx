export default function LayoutVagas({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <p className="mt-0 text-xs font-medium tracking-wider text-suave uppercase">
        Vagas abertas
      </p>
      {children}
    </section>
  );
}
