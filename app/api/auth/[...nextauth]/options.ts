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
      clientId:
        "353469902540-9jltm2hc9q345pmalbrhud8daujo305n.apps.googleusercontent.com",
      clientSecret: "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",
    }),
  ],
  callbacks: {
    async signIn({ user }: { user: User }) {
      const userObject = {
        full_name: user.name,
        email: user.email,
        theme: "light",
      };
      const req = await fetch("http://localhost:3000/api/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userObject),
      });
      return true;
    },
  },
};

export default authOptions;
