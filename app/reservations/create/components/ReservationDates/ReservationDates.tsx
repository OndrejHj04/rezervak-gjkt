import ReservationDatesRender from "./ReservationDatesRender";

const getReservations = async () => {
  try {
    const request = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/reservations/list`,
      { cache: "no-cache" }
    );
    const { data } = await request.json();
    return data;
  } catch (e) {
    return [];
  }
};

export default async function ReservationDates() {
  const reservations = await getReservations();
  console.log("test");
  return <ReservationDatesRender reservations={reservations} />;
}
