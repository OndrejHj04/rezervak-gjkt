import { Button, Paper, Typography } from "@mui/material";
import ElderlyIcon from "@mui/icons-material/Elderly";
import SingleReservation from "../reservations/SingleReservation";
import ReservationPagination from "../reservations/ReservationsPagination";
import { useSearchParams } from "next/navigation";

const getReservations = async (id: any, page: any) => {
  try {
    const req = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/reservations/list?status=1&limit=5&page=${page}`
    );
    const data = await req.json();
    return data;
  } catch (e) {
    return [];
  }
};

export default async function PastReservationsWidget({
  user: { user },
  searchParams,
}: {
  user: { user: any };
  searchParams: any;
}) {
  const page = searchParams["archive"] || 1;
  const reservations = await getReservations(user.id, page);

  return (
    <Paper className="p-2 flex flex-col">
      <div className="flex justify-between items-center gap-3">
        <ElderlyIcon color="primary" />
        <Typography variant="h5">Uskutečněné rezervace</Typography>
        <ElderlyIcon color="primary" />
      </div>
      {reservations.data.length ? (
        reservations.data.map((reservation: any) => (
          <SingleReservation key={reservation.id} reservations={reservation} />
        ))
      ) : (
        <Typography className="text-center">
          Všechny uskutečněné rezervace mají stav {"archiv"}
        </Typography>
      )}
      <ReservationPagination count={reservations.count} name="archive" />
      <Button variant="contained" className="mt-auto">
        Archivovat rezervace
      </Button>
    </Paper>
  );
}
