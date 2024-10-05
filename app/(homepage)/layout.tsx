import { getUserDetailByEmail } from "@/lib/api";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";
import HomepageLoading from "../HomepageLoading";
import { Paper, Typography } from "@mui/material";

export default async function Layout({ WelcomeWidget, GroupsWidget, CalendarWidget, ReservationsWidget }: { children: any, WelcomeWidget: React.ReactNode, GroupsWidget: React.ReactNode, CalendarWidget: React.ReactNode, ReservationsWidget: React.ReactNode }) {

  const user = (await getServerSession(authOptions)) as any;

  const data: any = user ? await getUserDetailByEmail({ email: user?.user.email }) : []

  const homepage = (
    <div className="w-full h-full flex flex-col">
      {      /* {WelcomeWidget} */}
      <div className="flex-1 flex sm:flex-row flex-col gap-2">
        <div
          className="grid grid-rows-2 gap-2"
        >
          {GroupsWidget}
          {ReservationsWidget}
        </div>
        {CalendarWidget}
      </div>
    </div>
  )

  return <HomepageLoading homepage={homepage} user={data[0]} />;
}
