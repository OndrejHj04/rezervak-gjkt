"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function MailingRefetch(mode?: any) {
  revalidatePath("/mailing");
  redirect(`/mailing?mode=${mode}`);
}
