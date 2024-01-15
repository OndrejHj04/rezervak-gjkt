import { getServerSession } from "next-auth";
import ReservationDetailRender from "./ReservationDetailRender";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export default async function ReservationDetail() {
  const { user } = (await getServerSession(authOptions)) as any;

  return <ReservationDetailRender id={user.id} />;
}
