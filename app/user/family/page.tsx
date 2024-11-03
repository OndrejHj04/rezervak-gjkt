import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import CreateFamilyAccountForm from "./FamilyAccountForm";

export default async function CreateFamilyAccount() {
  const { user } = await getServerSession(authOptions) as any

  return <CreateFamilyAccountForm user={user} />
}
