"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function MakeReservationDetailRefetch(id: number) {
  revalidatePath(`/reservations/detail/${id}`);
  redirect(`/reservations/detail/${id}`);
}
