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
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/list?email=${profile.email}`
        );
        const { data } = await req.json();

        if (!data.picture && profile.picture) {
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/login/upload-pic`,
            {
              method: "POST",
              body: JSON.stringify({
                picture: profile.picture,
                id: data[0].id,
              }),
            }
          );
        }
        if (data.length) {
          return {
            ...data[0],
            status: true,
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
        console.log("TEST!", credentials);
        const request = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/login`,
          {
            method: "POST",
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          }
        );
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
        token.id = user.id as number;
        token.verified = user.verified;
        token.active = user.active;
      }
      return token;
    },
    async session({ session, token }) {
      //provider
      if (session?.user) {
        session.user.role = token.role;
        session.user.id = token.id;
        session.user.verified = token.verified;
        session.user.active = token.active;
      }
      console.log("SESSION", session);
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
