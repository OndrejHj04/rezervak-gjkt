import {
  MenuItem,
  MenuList,
  Paper,
  TablePagination,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { User, getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import SingleReservation from "./SingleReservation";
import EventIcon from "@mui/icons-material/Event";
import ReservationPagination from "./ReservationsPagination";
import ReservationsSwitch from "./ReservationsSwitch";
import RenderCalendar from "../calendar/RenderCalendar";
import fetcher from "@/lib/fetcher";

const getReservations = async (id: number, page: string) => {
  try {
    const data = await fetcher(
      `/api/reservations/user-list?id=${id}&page=${page}`,
      { cache: "no-cache" }
    );

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

  const reservations = data
    ? ((await getReservations(
        data.user.id,
        searchParams.reservations || "1"
      )) as any)
    : [];

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
        {searchParams.mode === "list" && (
          <ReservationPagination
            count={reservations.count}
            name="reservations"
          />
        )}
      </div>
    </Paper>
  );
}
