import { getServerSession } from "next-auth";
import UserDetail from "./UserDetail";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export default async function UserListConfig({
  searchParams,
  params,
}: {
  searchParams: any;
  params: any;
}) {
  const {
    user: {
      id: userId,
      role: { id },
    },
  } = (await getServerSession(authOptions)) as any;

  return (
    <UserDetail
      params={params.id}
      searchParams={searchParams}
      userRole={id}
      userId={userId}
    />
  );
}
