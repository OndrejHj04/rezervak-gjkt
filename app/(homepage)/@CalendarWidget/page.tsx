import { getReservationCalendarData } from "@/lib/api";
import FullcalendarWidget from "./CalendarNavigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

export default async function Page({ searchParams }: { searchParams: any }) {
  const data = await getReservationCalendarData({ rooms: searchParams.rooms?.length ? searchParams.rooms.split(",") : [] })
  const { user } = await getServerSession(authOptions) as any

  return (
    <FullcalendarWidget data={data} searchParams={searchParams} role={user.role} />
  )
}
