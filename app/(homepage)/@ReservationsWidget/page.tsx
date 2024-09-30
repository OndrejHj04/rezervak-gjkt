import { MenuList, Paper, Typography } from "@mui/material";
import SingleReservation from "./SingleReservation";
import EventIcon from "@mui/icons-material/Event";
import TableListPagination from "@/ui-components/TableListPagination";
import { userSpecifiedReservations } from "@/lib/api";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

export default async function DisplayReservations({
  searchParams,
}: {
  searchParams: any;
}) {

  const user = (await getServerSession(authOptions)) as any;

  const reservations = await userSpecifiedReservations({
    userId: user.user.id,
    page: Number(searchParams.reservations) || 1,
  });

  return (
    <Paper className="p-2 flex-col flex">
      <div className="flex justify-between items-center gap-3">
        <EventIcon color="primary" />
        <Typography variant="h5">Moje rezervace</Typography>
        <EventIcon color="primary" />
      </div>
        <MenuList>
          {reservations.data.length ? (
            reservations.data.map((reservation: any) => (
              <SingleReservation
                key={reservation.id}
                reservations={reservation}
              />
            ))
          ) : (
            <Typography className="text-center">žádné rezervace</Typography>
          )}
        </MenuList>
      <div className="mt-auto">
          <TableListPagination
            rpp={5}
            count={reservations.count || 0}
            name="reservations"
          />
      </div>
    </Paper>
  );
}
