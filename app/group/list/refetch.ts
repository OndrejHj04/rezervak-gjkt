"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function MakeGroupRefetch() {
  revalidatePath("/group/list");
  redirect("/group/list");
}
