import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { conferirLogin } from "@/lib/api";
import { EsquemaDoLogin } from "@/lib/esquemas";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/entrar" },
  providers: [
    Credentials({
      credentials: { email: {}, senha: {} },
      async authorize(credenciais) {
        const analise = EsquemaDoLogin.safeParse(credenciais);
        if (!analise.success) return null;
        // (aula 09) Quem confere agora é a API. O bcrypt e o prisma saíram daqui.
        const pessoa = await conferirLogin(analise.data.email, analise.data.senha);
        if (!pessoa) return null;
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