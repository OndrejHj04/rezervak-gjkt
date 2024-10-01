import { getReservationCalendarData } from "@/lib/api";
import FullcalendarWidget from "./CalendarNavigation";

export default async function Page({searchParams}:{searchParams: any}){
  const data = await getReservationCalendarData({rooms: searchParams.rooms?.length ? searchParams.rooms.split(",") : []})

  return(
    <FullcalendarWidget data={data} searchParams={searchParams}/>
  )
}
