export default function Loading() {
  return (
    <ul className="grid gap-3" aria-hidden="true">
      {[1, 2, 3, 4].map((n) => (
        <li key={n} className="h-18 rounded-xl bg-superficie motion-safe:animate-pulse" />
      ))}
    </ul>
  );
}
