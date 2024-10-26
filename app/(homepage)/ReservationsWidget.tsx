import { MenuItem, MenuList, Paper, Typography } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import { userSpecifiedReservations } from "@/lib/api";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import Link from "next/link";
import dayjs from "dayjs";


export default async function ReservationsWidget() {

  const user = (await getServerSession(authOptions)) as any;

  const reservations = await userSpecifiedReservations({
    userId: user?.user.id,
  });

  return (
    <Paper className="p-2 flex-col flex w-full" style={{ minWidth: "300px" }}>
      <div className="flex justify-between items-center gap-3">
        <EventIcon color="primary" />
        <Typography variant="h5">Moje rezervace</Typography>
        <EventIcon color="primary" />
      </div>
      <MenuList>
        {reservations.data.map((reservation: any) => (
          <MenuItem className="flex !justify-between gap-2 px-1" component={Link} href={`/reservation/detail/${reservation.id}`}>
            <Typography noWrap>{reservation.name}</Typography>
            <Typography color="text.secondary" sx={{ fontSize: 14 }}>{`Datum: ${dayjs(
              reservation.from_date
            ).format("DD.MM.")} - ${dayjs(reservation.to_date).format(
              "DD.MM."
            )}`}</Typography>
          </MenuItem>
        ))
        }
      </MenuList>
    </Paper>
  );
}
