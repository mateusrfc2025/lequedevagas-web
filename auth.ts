import NextAuth, { type DefaultSession } from "next-auth";
import "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { EsquemaDoLogin } from "@/lib/esquemas";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      papel: string;
    } & DefaultSession["user"];
  }
  interface User {
    id?: string;
    papel?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    papel?: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credenciais",
      credentials: {
        email: { label: "E-mail", type: "email" },
        senha: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const analise = EsquemaDoLogin.safeParse(credentials);
        if (!analise.success) return null;

        const { email, senha } = analise.data;

        const pessoa = await prisma.pessoa.findUnique({
          where: { email },
        });

        if (!pessoa) return null;

        const senhaValida = await bcrypt.compare(senha, pessoa.senha);
        if (!senhaValida) return null;

        return {
          id: String(pessoa.id),
          name: pessoa.nome,
          email: pessoa.email,
          papel: pessoa.papel,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.papel = user.papel;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.papel = token.papel as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/entrar",
  },
  session: {
    strategy: "jwt",
  },
});