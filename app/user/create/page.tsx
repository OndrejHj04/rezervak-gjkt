import fetcher from "@/lib/fetcher";
import NewUserForm from "./NewUserForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

const getRoles = async (role: any) => {
  const { data } = await fetcher(`/api/roles/list?role=${role.id}`);
  return data;
};

export default async function CreateUserForm() {
  const user = (await getServerSession(authOptions)) as any;
  const roles = await getRoles(user?.user.role);

  return <NewUserForm roles={roles} />;
}
