import ReservationDetailForm from "./ReservationDetailForm";
import { Reservation, ReservationStatus } from "@/types";
import ReservationDetailNavigation from "./ReservationDetailNavigation";
import ReservationDetailDisplay from "./ReservationDetailDisplay";

const getReservation = async (id: string) => {
  const req = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/reservations/detail/${id}`,
    { cache: "no-cache" }
  );
  const { data } = await req.json();

  return data[0];
};

const getReservationStatus = async () => {
  const req = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/reservations/status`
  );
  const { data } = await req.json();

  return data;
};

export default async function ReservationDetailPage({
  params: { id },
  searchParams: { mode },
}: {
  params: { id: string };
  searchParams: { mode: any };
}) {
  const reservation = (await getReservation(id)) as Reservation;
  const reservationStatus =
    (await getReservationStatus()) as ReservationStatus[];

  return (
    <>
      <ReservationDetailNavigation id={id} mode={mode} />
      {mode === "edit" ? (
        <ReservationDetailForm
          reservation={reservation}
          reservationStatus={reservationStatus}
        />
      ) : (
        <ReservationDetailDisplay reservation={reservation} />
      )}
    </>
  );
}
