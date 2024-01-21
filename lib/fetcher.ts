"use server";
import { cookies } from "next/headers";

export default async function fetcher(
  url: any,
  {
    method,
    body,
    cache,
    headers,
  }: { method?: any; body?: any; cache?: any; headers?: any } = {}
) {
  const cookieStore = cookies();
  const token = cookieStore.get("next-auth.session-token")?.value;
  console.log(url, body)
  const req = await fetch(process.env.NEXT_PUBLIC_API_URL + url, {
    headers: {
      Authorization: `Bearer ${token}` as any,
      ...headers,
    },
    method,
    body,
    cache,
  });
  const data = await req.json();

  return data;
}
