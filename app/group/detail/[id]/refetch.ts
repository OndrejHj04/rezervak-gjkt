"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function MakeGroupDetailRefetch(id: number) {
  revalidatePath(`/group/detail/${id}`);
  redirect(`/group/detail/${id}`);
}
