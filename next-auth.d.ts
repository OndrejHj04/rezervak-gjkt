import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      role: {
        role_id: number;
        role_name: string;
        role_color: string;
      };
      id: string;
      image: string;
      verified: boolean;
      first_name: string;
      last_name: string;
      status?: boolean;
      adress: string;
      ID_code: string;
      birth_date: string;
    } & DefaullSession;
  }

  interface User extends DefaultUser {
    role: {
      role_id: number;
      role_name: string;
      role_color: string;
    };
    id: string;
    image: string;
    verified: boolean;
    first_name: string;
    last_name: string;
    status?: boolean;
    birth_date: string;
    adress: string;
    ID_code: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: {
      role_id: number;
      role_name: string;
      role_color: string;
    };
    id: string;
    image: string;
    verified: boolean;
    first_name: string;
    last_name: string;
    status?: boolean;
    adress: string;
    ID_code: string;
    birth_date: string;
  }
}
