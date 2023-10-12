import { MenuList, Paper, Typography } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";

export default function DisplayReservations() {
  return (
    <Paper className="p-2">
      <div className="flex justify-between items-center gap-3">
        <EventIcon color="primary" />
        <Typography variant="h5">Moje skupiny</Typography>
        <EventIcon color="primary" />
      </div>
      <MenuList>
        <Typography>žádné nadcházející rezervace</Typography>
      </MenuList>
    </Paper>
  );
}
