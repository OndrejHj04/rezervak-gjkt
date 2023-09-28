import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import RunningWithErrorsIcon from "@mui/icons-material/RunningWithErrors";

export default function VerifyUser() {
  return (
    <Paper className="p-2">
      <div className="flex justify-between">
        <RunningWithErrorsIcon sx={{ color: "#ED9191" }} />
        <Typography variant="h5">Ověření účtu</Typography>
        <RunningWithErrorsIcon sx={{ color: "#ED9191" }} />
      </div>
      <Typography variant="body2">
        Je potřeba doplnit několik informací!
      </Typography>
      <div className="flex flex-col gap-2">
        <TextField label="Současné heslo" />
        <TextField label="Nové heslo" />
        <Button variant="contained">Odeslat</Button>
      </div>
    </Paper>
  );
}
