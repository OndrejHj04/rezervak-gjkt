import RenderCalendar from "./RenderCalendar";
import { Paper, Typography } from "@mui/material";
import CottageIcon from "@mui/icons-material/Cottage";
import { getReservationList } from "@/lib/api";


export default async function HomepageCalendar() {
  const { data } = await getReservationList({ notStatus: [1, 4] });

  return (
    <Paper className="p-2">
      <div className="flex justify-between items-center gap-3">
        <CottageIcon color="primary" />
        <Typography variant="h5">Všechny rezervace</Typography>
        <CottageIcon color="primary" />
      </div>
      <RenderCalendar reservations={data} />
    </Paper>
  );
}
