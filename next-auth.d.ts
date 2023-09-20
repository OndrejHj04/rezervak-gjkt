import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      role: string;
      id: string;
    } & DefaullSession;
  }

  interface User extends DefaultUser {
    role: string;
    id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: string;
    id: string;
  }
}
