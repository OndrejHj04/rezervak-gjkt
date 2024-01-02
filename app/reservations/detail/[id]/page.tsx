import { getServerSession } from "next-auth";
import ReservationDetail from "./ReservationDetail";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export default async function GroupListConfig({
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
    <ReservationDetail
      params={params.id}
      searchParams={searchParams}
      userRole={id}
      userId={userId}
    />
  );
}
