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

export const reservationsExport = async (status: any) => {
  const reservations = (await query({
    query: `SELECT * FROM reservations ${status ? "WHERE status = ?" : ""}`,
    values: [status],
  })) as any;

  return reservations;
};

export const groupsExport = async (status: any) => {
  const groups = (await query({
    query: `SELECT * FROM ${"`groups`"} ${status ? "WHERE status = ?" : ""}`,
    values: [status],
  })) as any;

  return groups;
};
