"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function MakeUserListRefetch(url: any, type?: any) {
  revalidatePath("/user/list");
  type === 1 && redirect("/user/list");
}
