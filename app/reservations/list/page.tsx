import { getServerSession } from "next-auth";
import ResevationList from "./ReservationList";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export default async function ReservationListConfig({
  searchParams,
}: {
  searchParams: any;
}) {
  const {
    user: {
      role: { id },
    },
  } = (await getServerSession(authOptions)) as any;

  return <ResevationList searchParams={searchParams} userRole={id} />;
}
