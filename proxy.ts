import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((pedido) => {
  if (!pedido.auth) {
    return NextResponse.redirect(new URL("/entrar", pedido.nextUrl));
  }
});

export const config = {
  matcher: ["/vagas/nova", "/painel", "/empresas/:slug/editar"],
};