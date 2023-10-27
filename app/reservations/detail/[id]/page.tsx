import { Typography } from "@mui/material";
import ReservationDetailForm from "./ReservationDetailForm";

const getReservation = async (id: string) => {
  const req = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/reservations/detail/${id}`,
    { cache: "no-cache" }
  );
  const { data } = await req.json();

  return data[0];
};

export default async function ReservationDetailPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const reservation = await getReservation(id);

  return <ReservationDetailForm reservation={reservation} />;
}
