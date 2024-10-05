import { MenuList, Paper, Typography } from "@mui/material";
import SingleReservation from "./SingleReservation";
import EventIcon from "@mui/icons-material/Event";
import TableListPagination from "@/ui-components/TableListPagination";
import { userSpecifiedReservations } from "@/lib/api";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

const rowsPerPage = 5

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
    <Paper className="p-2 flex-col flex w-full" style={{ minWidth: "300px" }}>
      <div className="flex justify-between items-center gap-3">
        <EventIcon color="primary" />
        <Typography variant="h5">Moje rezervace</Typography>
        <EventIcon color="primary" />
      </div>
      <MenuList>
        {
          reservations.data.map((reservation: any) => (
            <SingleReservation
              key={reservation.id}
              reservations={reservation}
            />
          ))
        }
      </MenuList>
      {reservations.count > rowsPerPage && <div className="mt-auto">
        <TableListPagination
          rpp={5}
          count={reservations.count || 0}
          name="reservations"
        />
      </div>
      }    </Paper>
  );
}
