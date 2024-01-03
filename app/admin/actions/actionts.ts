"use server";
import { query } from "@/lib/db";

export const setTheme = async (theme: any, id: any) => {
  const req = (await query({
    query: `UPDATE users SET theme = ${!theme} WHERE id = "${id}"`,
    values: [],
  })) as any;
};

export const getExportData = async (type: any) => {
  const data = (await query({
    query: "SELECT * FROM " + "`" + type + "`",
    values: [],
  })) as any;

  return data;
};
