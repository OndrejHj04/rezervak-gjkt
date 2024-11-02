import ReservationDatesRender from "./ReservationDatesRender";
import { getReservationList, getReservationsByWeekCalendar } from "@/lib/api";

export default async function ReservationDates() {
  const { data } = await getReservationsByWeekCalendar()

  return <ReservationDatesRender reservations={data} />;
}
