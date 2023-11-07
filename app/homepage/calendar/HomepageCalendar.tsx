import { User, getServerSession } from "next-auth";
import RenderCalendar from "./RenderCalendar";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { Paper, Typography } from "@mui/material";
import CottageIcon from "@mui/icons-material/Cottage";
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

export default async function HomepageCalendar() {
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
