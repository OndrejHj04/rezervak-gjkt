import { getServerSession } from "next-auth";
import CalendarWidget from "./CalendarWidget";
import GroupWidget from "./GroupsWidget";
import ReservationsWidget from "./ReservationsWidget";
import { authOptions } from "../api/auth/[...nextauth]/options";

export default async function Page({ searchParams }: { searchParams: any }) {

  const data = await getServerSession(authOptions)

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 flex sm:flex-row flex-col gap-2">
        <div
          className="grid grid-rows-2 gap-2"
        >
          <GroupWidget />
          <ReservationsWidget />
        </div>
        <CalendarWidget searchParams={searchParams} />
      </div>
    </div>
  )
}
