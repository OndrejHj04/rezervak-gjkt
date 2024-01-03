"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function MakeReservationDetailRefetch(id: number) {
  revalidatePath(`/reservation/detail/${id}`);
  redirect(`/reservation/detail/${id}?mode=edit`);
}
