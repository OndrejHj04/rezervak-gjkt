import { getReservationCalendarData } from "@/lib/api";
import FullcalendarWidget from "../(homepage)/@CalendarWidget/CalendarNavigation";

export default async function AdminPanel({ searchParams }: { searchParams: any }) {

  const data = await getReservationCalendarData({ rooms: searchParams.rooms?.length ? searchParams.rooms.split(",") : [] })
  return (
    <FullcalendarWidget searchParams={searchParams} data={data} type="admin" />
  )
}
