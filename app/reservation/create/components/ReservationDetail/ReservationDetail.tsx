import { getServerSession } from "next-auth";
import ReservationDetailRender from "./ReservationDetailRender";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getUsersBySearch } from "@/lib/api";

export default async function ReservationDetail() {
  const { user } = (await getServerSession(authOptions)) as any;
  const { data } = await getUsersBySearch()

  return <ReservationDetailRender user={user} options={data} />;
}
