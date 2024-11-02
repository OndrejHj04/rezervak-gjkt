import { getServerSession } from "next-auth";
import GroupNewForm from "./GroupNewForm";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getUsersBySearch } from "@/lib/api";

export default async function CreateGroupForm() {
  const { data } = await getUsersBySearch();
  const { user } = (await getServerSession(authOptions)) as any;

  return <GroupNewForm options={data} user={user} />;
}
