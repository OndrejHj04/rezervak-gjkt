"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function MakeUserListRefetch() {
  revalidatePath("/user/list");
  redirect("/user/list");
}
