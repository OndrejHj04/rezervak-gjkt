import { getServerSession } from "next-auth";
import GroupNewForm from "./GroupNewForm";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

const getAccounts = async () => {
  const req = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/list`, {
    cache: "no-cache",
  });
  const { data } = await req.json();
  return data;
};

export default async function CreateGroupForm() {
  const accounts = (await getAccounts()) as any;
  const { user } = (await getServerSession(authOptions)) as any;
  return <GroupNewForm users={accounts} user={user} />;
}
