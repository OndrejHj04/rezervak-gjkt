"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function ReservationListMakeRefetch(url: string) {
  revalidatePath("/reservations/list");
  redirect(url);
}

