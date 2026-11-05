const BARRA = "rounded-md bg-superficie motion-safe:animate-pulse";

export default function Loading() {
  return (
    <article aria-busy="true" aria-hidden="true">
      <div className={`${BARRA} mb-4 h-10 w-[70%]`} />
      <div className={`${BARRA} mb-8 h-5 w-1/2`} />
      <div className={`${BARRA} mb-8 h-9 w-37.5 rounded-full`} />
      <div className={`${BARRA} mb-2 h-5 w-full`} />
      <div className={`${BARRA} mb-2 h-5 w-full`} />
      <div className={`${BARRA} mb-10 h-5 w-[80%]`} />
      <div className={`${BARRA} mb-4 h-8 w-[40%]`} />
      <div className={`${BARRA} h-87.5 w-full`} />
    </article>
  );
}
