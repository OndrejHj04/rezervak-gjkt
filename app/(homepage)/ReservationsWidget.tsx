import { ListItemText, MenuItem, MenuList, Paper, Typography } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import Link from "next/link";
import dayjs from "dayjs";
import { getUserReservationsWidgetData } from "@/lib/api";
import ClientScrollbar from "@/lib/ClientScrollbar";
import { smartTime } from "../constants/smartTime";


export default async function ReservationsWidget() {

  const { user } = (await getServerSession(authOptions)) as any;
  const { data } = await getUserReservationsWidgetData({ userId: user.id })


  return (
    <Paper className="p-2 flex flex-col flex-1 min-w-[300px] max-h-full overflow-hidden">
      <div className="flex justify-between items-center gap-3">
        <EventIcon color="primary" />
        <Typography variant="h5">Moje rezervace</Typography>
        <EventIcon color="primary" />
      </div>
      <div className="flex-1 overflow-y-auto">
        <ClientScrollbar>
          <MenuList disablePadding>
            {data.map((reservation: any) => (
              <MenuItem key={reservation.id} className="!px-0" component={Link} href={`/reservation/detail/${reservation.id}/info`}>
                <ListItemText>{reservation.name}</ListItemText>
                <Typography color="text.secondary">{smartTime(reservation.from_date)}</Typography>
              </MenuItem>
            ))}
          </MenuList>
        </ClientScrollbar>
      </div>
    </Paper>
  );
}
