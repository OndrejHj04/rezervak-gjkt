"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function MakeGroupDetailRefetch(id: number, type?: any) {
  revalidatePath(`/group/detail/${id}`);
  type === 1 && redirect(`/group/detail/${id}`);
}
