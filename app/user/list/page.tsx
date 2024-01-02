import { getServerSession } from "next-auth";
import UserList from "./UserList";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export default async function UserListConfig({
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

  return <UserList searchParams={searchParams} userRole={id} userId={userId} />;
}
