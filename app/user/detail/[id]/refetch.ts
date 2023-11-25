"use server";
import { revalidatePath } from "next/cache";

export default async function MakeUserDetailRefetch(id: number) {
  revalidatePath(`/user/detail/${id}`);
}
