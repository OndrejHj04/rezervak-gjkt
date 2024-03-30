import { getServerSession } from "next-auth";
import GroupNewForm from "./GroupNewForm";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getUserList } from "@/lib/api";

export default async function CreateGroupForm() {
  const { data } = await getUserList();
  const { user } = (await getServerSession(authOptions)) as any;

  return <GroupNewForm users={data} user={user} />;
}
