import { getServerSession } from "next-auth";
import ReservationMembersRender from "./ReservationMembersRender";
import { getUserGroupsWhereOwner } from "@/lib/api";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export default async function ReservationMembers() {
  const { user } = await getServerSession(authOptions) as any
  const { data } = await getUserGroupsWhereOwner({
    userId: user.id,
  })

  return <ReservationMembersRender groups={data} />;
}
