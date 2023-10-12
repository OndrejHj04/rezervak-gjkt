"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function MakeRefetch() {
  revalidatePath("/group/list");
  redirect("/group/list");
}
