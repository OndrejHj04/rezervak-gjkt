"use server";
import { cookies } from "next/headers";

export default async function fetcher(
  url: any,
  {
    method,
    body,
    cache,
    token,
    headers,
  }: { method?: any; body?: any; cache?: any; headers?: any; token?: any } = {}
) {
  const cookieStore = cookies();
  const authToken =
    cookieStore.get("next-auth.session-token")?.value ||
    token.replace("Bearer ", "");
  const req = await fetch(process.env.NEXT_PUBLIC_API_URL + url, {
    headers: {
      Authorization: `Bearer ${authToken}` as any,
      ...headers,
    },
    method,
    body,
    cache,
  });
  const data = await req.json();

  return data;
}
