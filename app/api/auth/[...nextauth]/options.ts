import GoogleProvider from "next-auth/providers/google";
import { User } from "next-auth";
interface type {
  name: string;
}
const authOptions = {
  secret: process.env.NEXTAUTH_SECRET as string,
  jwt: {
    secret: process.env.NEXTAUTH_SECRET as string,
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user }: { user: User }) {
      const userObject = {
        full_name: user.name,
        email: user.email,
        theme: "light",
      };
      const req = await fetch(`${process.env.NEXT_URL}/api/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userObject),
      });
      console.log(req);
      return true;
    },
  },
};

export default authOptions;
