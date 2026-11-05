import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { EsquemaDoLogin } from "@/lib/esquemas";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/entrar" },
  providers: [
    Credentials({
      async authorize(credenciais) {
        const analise = EsquemaDoLogin.safeParse(credenciais);
        if (!analise.success) return null;

        const pessoa = await prisma.pessoa.findUnique({
          where: { email: analise.data.email },
        });
        if (!pessoa) return null;

        const confere = await bcrypt.compare(analise.data.senha, pessoa.senhaHash);
        if (!confere) return null;

        return { id: pessoa.id };
      },
    }),
  ],
  callbacks: {
    // o crachá guarda só o id
    jwt({ token, user }) {
      if (user?.id) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (token.id && session.user) session.user.id = token.id as string;
      return session;
    },
  },
});
