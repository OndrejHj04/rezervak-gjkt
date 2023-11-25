import { MenuList, Paper, Typography } from "@mui/material";
import { Reservation } from "@/types";
import { User, getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import SingleReservation from "./SingleReservation";
import EventIcon from "@mui/icons-material/Event";

const getReservations = async (id: number) => {
  try {
    const req = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/reservations/list?user_id=${id}`
    );
    const { data } = await req.json();

    return data;
  } catch (e) {
    return [];
  }
};

export default async function DisplayReservations() {
  const data = (await getServerSession(authOptions)) as { user: User };

  const reservations = data
    ? ((await getReservations(data.user.id)) as Reservation[])
    : [];

  return (
    <Paper className="p-2">
      <div className="flex justify-between items-center gap-3">
        <EventIcon color="primary" />
        <Typography variant="h5">Nadcházející rezervace</Typography>
        <EventIcon color="primary" />
      </div>
      <MenuList>
        {reservations?.length ? (
          reservations.map((reservation) => (
            <SingleReservation
              key={reservation.id}
              reservations={reservation}
            />
          ))
        ) : (
          <Typography>žádné rezervace</Typography>
        )}
      </MenuList>
    </Paper>
  );
}
