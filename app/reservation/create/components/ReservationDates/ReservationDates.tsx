import ReservationDatesRender from "./ReservationDatesRender";
import { getReservationList } from "@/lib/api";

export default async function ReservationDates() {
  const { data } = await getReservationList({ notStatus: [1] });
  return <ReservationDatesRender reservations={data} />;
}
