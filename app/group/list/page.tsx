import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import GroupList from "./GroupList";

export default async function GroupListConfig({
  searchParams,
}: {
  searchParams: any;
}) {
  const {
    user: {
      id: userId,
      role: { id },
    },
  } = (await getServerSession(authOptions)) as any;

  return (
    <GroupList searchParams={searchParams} userRole={id} userId={userId} />
  );
}
