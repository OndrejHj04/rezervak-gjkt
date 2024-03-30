import { MenuList, Paper, Typography } from "@mui/material";
import SingleReservation from "./SingleReservation";
import EventIcon from "@mui/icons-material/Event";
import ReservationsSwitch from "./ReservationsSwitch";
import RenderCalendar from "../calendar/RenderCalendar";
import TableListPagination from "@/ui-components/TableListPagination";
import { userSpecifiedReservations } from "@/lib/api";

export default async function DisplayReservations({
  searchParams,
  data,
}: {
  searchParams: any;
  data: any;
}) {
  const reservations = await userSpecifiedReservations({
    userId: data.user.id,
    page: Number(searchParams.reservations) || 1,
  });

  return (
    <Paper className="p-2 flex-col flex">
      <div className="flex justify-between items-center gap-3">
        <EventIcon color="primary" />
        <Typography variant="h5">Moje rezervace</Typography>
        <EventIcon color="primary" />
      </div>
      {searchParams.mode === "calendar" ? (
        <RenderCalendar reservations={reservations.data} />
      ) : (
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
      )}
      <div className="mt-auto flex items-center justify-between">
        <ReservationsSwitch />
        {searchParams.mode !== "calendar" && (
          <TableListPagination
            rpp={5}
            count={reservations.count || 0}
            name="reservations"
          />
        )}
      </div>
    </Paper>
  );
}
