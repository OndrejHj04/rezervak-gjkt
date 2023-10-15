import { Paper, Slider, Typography } from "@mui/material";

export default function ReservationRoomsSlider() {
  return (
    <Paper className="p-2">
      <Typography variant="h5">Počet pokojů</Typography>
      <Slider />
    </Paper>
  );
}
