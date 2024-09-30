import { getUserDetailByEmail } from "@/lib/api";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";
import HomepageLoading from "../HomepageLoading";

export default async function Layout({ GroupsWidget, CalendarWidget, ReservationsWidget }: { children: any, GroupsWidget: React.ReactNode, CalendarWidget: React.ReactNode, ReservationsWidget: React.ReactNode }) {

  const user = (await getServerSession(authOptions)) as any;

  const data: any = user ? await getUserDetailByEmail({ email: user?.user.email }) : []

  const homepage = (
    <div className="w-full h-full flex sm:flex-row flex-col gap-2">
      <div
        className="grid grid-rows-2 grid-cols-1 gap-2"
      >
        {GroupsWidget}
        {ReservationsWidget}
      </div>
      {CalendarWidget}
    </div>
  )

  return <HomepageLoading homepage={homepage} user={data[0]} />;
}
