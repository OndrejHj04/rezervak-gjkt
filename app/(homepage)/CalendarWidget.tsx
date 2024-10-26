import { getReservationCalendarData } from "@/lib/api";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import FullcalendarComponent from "./Fullcalendar";

export default async function CalendarWidget({ searchParams }: { searchParams: any }) {
  const data = await getReservationCalendarData({ rooms: searchParams.rooms?.length ? searchParams.rooms.split(",") : [] })
  const user = await getServerSession(authOptions) as any

  return (
    <FullcalendarComponent data={data} searchParams={searchParams} role={user?.user.role} />
  )
}
