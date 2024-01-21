import { getServerSession } from "next-auth";
import GroupNewForm from "./GroupNewForm";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import fetcher from "@/lib/fetcher";

const getAccounts = async () => {
  const { data } = await fetcher(`/api/users/list`, {
    cache: "no-cache",
  });
  return data;
};

export default async function CreateGroupForm() {
  const accounts = (await getAccounts()) as any;
  const { user } = (await getServerSession(authOptions)) as any;
  return <GroupNewForm users={accounts} user={user} />;
}
