import { ListItemText, MenuItem, MenuList, Paper, Typography } from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import { getUserRegistrationWidgetData } from "@/lib/api";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import CreateIcon from '@mui/icons-material/Create';
import Link from "next/link";
import ClientScrollbar from "@/lib/ClientScrollbar";

export default async function RegistrationWidget() {
  const { user } = (await getServerSession(authOptions)) as any;

  const { data } = await getUserRegistrationWidgetData({
    userId: user.id,
  });

  return (
    <Paper className="p-2 flex flex-col flex-1 min-w-[300px] max-h-full overflow-hidden">
      <div className="flex justify-between items-center gap-3">
        <CreateIcon color="primary" />
        <Typography variant="h5">Moje registrace</Typography>
        <CreateIcon color="primary" />
      </div>
      <div className="flex-1 overflow-y-auto min-h-[100px]">
        <ClientScrollbar>
          <MenuList disablePadding>
            {data.map((reservation: any) => (
              <MenuItem key={reservation.id} className="!px-0" component={Link} href={`/reservation/detail/${reservation.id}/registration`}>
                <ListItemText>{reservation.name}</ListItemText>
                {reservation.user_count > 0 ? <Typography className="text-red-500">Je nutné schválit účastníky!</Typography> : <Typography className="text-green-400">Vše v pořádku!</Typography>}
              </MenuItem>
            ))}
          </MenuList>
        </ClientScrollbar>
      </div>
    </Paper>
  );
}
