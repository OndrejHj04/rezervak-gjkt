import { decode } from "next-auth/jwt";
import { NextResponse } from "next/server";

export default async function protect(auth: any) {
  try {
    if (auth) {
      const token = auth.replace("Bearer ", "");

      return await decode({
        token,
        secret: process.env.NEXTAUTH_SECRET as any,
      });
    }

    return null;
  } catch (e) {
    return null;
  }
}
