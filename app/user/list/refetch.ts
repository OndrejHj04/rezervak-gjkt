"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function MakeUserListRefetch(url:any) {
  revalidatePath("/user/list");
  redirect(url);
}
