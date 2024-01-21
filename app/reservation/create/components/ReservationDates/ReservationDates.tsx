import fetcher from "@/lib/fetcher";
import ReservationDatesRender from "./ReservationDatesRender";

const getReservations = async () => {
  try {
    const { data } = await fetcher(`/api/reservations/list?not_status=4`, {
      cache: "no-cache",
    });
    return data;
  } catch (e) {
    return [];
  }
};

export default async function ReservationDates() {
  const reservations = await getReservations();
  return <ReservationDatesRender reservations={reservations} />;
}
