import ReservationDatesRender from "./ReservationDatesRender";

const getReservations = async () => {
  const request = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/reservations/list`,
    { cache: "no-cache" }
  );
  const { data } = await request.json();
  return data;
};

export default async function ReservationDates() {
  const reservations = await getReservations();
  return <ReservationDatesRender reservations={reservations} />;
}
