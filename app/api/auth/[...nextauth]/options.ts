import { userGoogleLogin, userLogin } from "@/lib/api";
import { NextAuthOptions } from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      async profile(profile) {
        const { user } = await userGoogleLogin({ account: profile })
        if (!user) return { ...profile, id: profile.sub, forbidden: true }
        return user
      },
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "enter name",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "enter password",
        },
      },
      async authorize(credentials: any) {
        const { email, password } = credentials;
        const { user } = await userLogin({ email, password });

        return { ...user }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token, user }) {
      session.user = token.user;
      return session
    },
    async signIn({ user }: any) {
      if (user.forbidden) return false

      return true
    },
  },
  pages: {
    signIn: "/",
    error: "/",
  },
  session: {
    maxAge: 60 * 60 * 24,
    strategy: "jwt"
  },
};
