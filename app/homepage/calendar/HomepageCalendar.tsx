import { User, getServerSession } from "next-auth";
import RenderCalendar from "./RenderCalendar";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { Paper, Typography } from "@mui/material";
import CottageIcon from "@mui/icons-material/Cottage";
import fetcher from "@/lib/fetcher";
const getReservations = async (id: number) => {
  try {
    const { data } = await fetcher(`/api/reservations/list?not_status=1,4`);
    return data;
  } catch (e) {
    return [];
  }
};

export default async function HomepageCalendar({ user }: { user: any }) {
  const data = (await getServerSession(authOptions)) as { user: User };
  const reservations = data ? await getReservations(data.user.id) : [];

  return (
    <Paper className="p-2">
      <div className="flex justify-between items-center gap-3">
        <CottageIcon color="primary" />
        <Typography variant="h5">Všechny rezervace</Typography>
        <CottageIcon color="primary" />
      </div>
      <RenderCalendar reservations={reservations} />
    </Paper>
  );
}
