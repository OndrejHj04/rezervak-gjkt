import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      role: {
        id: number;
        name: string;
      };
      id: number;
      image: string;
      verified: boolean;
      first_name: string;
      last_name: string;
      status?: boolean;
      adress: string;
      ID_code: string;
      birth_date: string;
      active: boolean;
      children: number[];
      parent: number;
    } & DefaullSession;
  }

  interface User extends DefaultUser {
    role: {
      id: number;
      name: string;
    };
    id: number;
    image: string;
    verified: boolean;
    first_name: string;
    last_name: string;
    status?: boolean;
    birth_date: string;
    adress: string;
    ID_code: string;
    active: boolean;
    children: number[];
    parent: number;
    full_name: string;
    groups: {
      id: number;
      name: string;
      owner: { id: number; first_name: string; last_name: string };
    }[];
    reservations: {
      id: number;
    }[];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: {
      id: number;
      name: string;
    };
    id: number;
    image: string;
    verified: boolean;
    first_name: string;
    last_name: string;
    status?: boolean;
    adress: string;
    ID_code: string;
    birth_date: string;
    active: boolean;
    children: number[];
    parent: number;
  }
}
