import { getUserDetailByEmail, userLogin } from "@/lib/api";
import { NextAuthOptions } from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { GoogleProfile } from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      async profile(profile: GoogleProfile) {
        const data = (await getUserDetailByEmail({
          email: profile.email,
        })) as any;

        if (
          data.length &&
          profile.picture &&
          data[0].image !== profile.picture
        ) {
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
      async authorize(credentials: any) {
        const { email, password } = credentials;
        const { data } = await userLogin({ email, password });

        return data || null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = user.role;
        token.id = user.id as number;
        token.verified = user.verified;
        token.active = user.active;
        token.first_name = user.first_name;
        token.last_name = user.last_name;
        token.image = user.image;
      }
      if (trigger === "update") {
        token = { ...token, ...session };
      }
      return token;
    },
    async session({ session, token, user }) {
      if (session?.user) {
        session.user = token;
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
    error: "/login?invalid=true",
  },
  session: {
    maxAge: 60 * 60 * 24,
  },
};
