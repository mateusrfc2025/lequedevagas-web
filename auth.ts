import NextAuth, { type DefaultSession } from "next-auth";
import "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import { conferirLogin } from "@/lib/api";
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

        // POST /sessoes: a API confere a senha e devolve a pessoa sem o hash.
        const gravou = await conferirLogin(email, senha);
        if (!gravou.ok) return null; // 401: e-mail ou senha errados

        const pessoa = gravou.dado;

        return {
          id: pessoa.id,
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