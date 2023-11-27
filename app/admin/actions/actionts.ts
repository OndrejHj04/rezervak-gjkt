"use server";
import { query } from "@/lib/db";

export const setTheme = async (theme: any, id: any) => {
  const req = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/theme`,
    {
      method: "POST",
      body: JSON.stringify({ theme, id }),
    }
  );
  const data = await req.json();
  return data;
};

export const getExportData = async (type: any) => {
  const data = (await query({
    query: "SELECT * FROM " + "`" + type + "`",
    values: [],
  })) as any;

  return data;
};
