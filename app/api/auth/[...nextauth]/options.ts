import GoogleProvider from "next-auth/providers/google";

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
};

export default authOptions;