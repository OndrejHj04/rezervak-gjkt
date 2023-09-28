import { NextAuthOptions } from "next-auth";
import { AdapterUser } from "next-auth/adapters";

import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { GoogleProfile } from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      async profile(profile: GoogleProfile) {
        const req = await fetch(
          `http://localhost:3000/api/users/list?email=${profile.email}`
        );
        const { data } = await req.json();
        if (data.length) {
          return {
            ...data[0],
            status: true,
            image: profile.picture,
          };
        } else {
          return { ...profile, id: profile.sub, status: false };
        }
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
      async authorize(credentials) {
        //tady budu dělat request na server s tím abych zjistil jestli je uživatel v databázi
        const request = await fetch("http://localhost:3000/api/users/login", {
          method: "POST",
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        });
        const { data } = await request.json();

        return data || null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      //credentials
      if (user) {
        token.role = user.role;
        token.image = user.image;
        token.first_name = user.first_name;
        token.last_name = user.last_name;
        token.id = user.id;
        token.verified = user.verified;
      }
      return token;
    },
    async session({ session, token }) {
      //provider
      if (session?.user) {
        session.user.role = token.role;
        session.user.image = token.image;
        session.user.first_name = token.first_name;
        session.user.last_name = token.last_name;
        session.user.id = token.id;
        session.user.verified = token.verified;
      }
      return session;
    },
    async signIn({ user, credentials }) {
      if (!user.status) {
        if (credentials) {
          return true;
        }
        return false;
      }
      return true;
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/invalid",
  },
  session: {
    maxAge: 60 * 60 * 24,
  },
};
