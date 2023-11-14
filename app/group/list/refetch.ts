"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function MakeGroupRefetch(url: any) {
  revalidatePath("/group/list");
  redirect(url);
}
