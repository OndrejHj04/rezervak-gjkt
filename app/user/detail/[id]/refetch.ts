"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function MakeUserDetailRefetch(id: number) {
  revalidatePath(`/user/detail/${id}`);
}
