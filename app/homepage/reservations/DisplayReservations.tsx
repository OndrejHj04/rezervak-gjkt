import { MenuList, Paper, TablePagination, Typography } from "@mui/material";
import { Reservation } from "@/types";
import { User, getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import SingleReservation from "./SingleReservation";
import EventIcon from "@mui/icons-material/Event";
import ReservationPagination from "./ReservationsPagination";

const getReservations = async (id: number, page: string) => {
  try {
    const req = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/reservations/user-list?id=${id}&page=${page}`
    );
    const data = await req.json();

    return data;
  } catch (e) {
    return [];
  }
};

export default async function DisplayReservations({
  searchParams,
}: {
  searchParams: any;
}) {
  const data = (await getServerSession(authOptions)) as { user: User };
  console.log(data, 'TEST!!!!')
  const reservations = data
    ? ((await getReservations(
        data.user.id,
        searchParams.reservations || "1"
      )) as any)
    : [];

  return (
    <Paper className="p-2">
      <div className="flex justify-between items-center gap-3">
        <EventIcon color="primary" />
        <Typography variant="h5">Nadcházející rezervace</Typography>
        <EventIcon color="primary" />
      </div>
      <MenuList>
        {reservations.data.map((reservation: any) => (
          <SingleReservation key={reservation.id} reservations={reservation} />
        ))}
      </MenuList>
      <ReservationPagination count={reservations.count} />
    </Paper>
  );
}
