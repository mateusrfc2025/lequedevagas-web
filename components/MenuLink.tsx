"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MenuLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const caminho = usePathname();
  const ativo = caminho === href;

  return (
    <Link
      href={href}
      aria-current={ativo ? "page" : undefined}
      className="text-suave no-underline aria-[current=page]:font-semibold aria-[current=page]:text-principal"
    >
      {children}
    </Link>
  );
}
