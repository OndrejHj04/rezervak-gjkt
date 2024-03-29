"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function ReservationListMakeRefetch() {
  revalidatePath("/reservation/list");
  redirect("/reservation/list");
}
