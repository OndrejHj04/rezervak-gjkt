import fetcher from "@/lib/fetcher";
import NewUserForm from "./NewUserForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getRolesList } from "@/lib/api";

export default async function CreateUserForm() {
  const { data } = await getRolesList({ filter: true });

  return <NewUserForm roles={data} />;
}
