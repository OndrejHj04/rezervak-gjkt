import { getServerSession } from "next-auth";
import CreateUserForm from "./CreateUserForm";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export default async function UserCreate() {
  const { user } = await getServerSession(authOptions) as any
  const role = user.role.id

  return <CreateUserForm role={role} />
}
