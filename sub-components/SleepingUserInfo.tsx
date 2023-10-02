import { Button, Divider, Paper, Typography } from "@mui/material";
import HotelIcon from "@mui/icons-material/Hotel";

export default function SleepingUserInfo() {
  return (
    <Paper className="flex flex-col gap-2 p-2 max-w-sm">
      <div className="flex justify-between gap-5">
        <HotelIcon sx={{ color: "#4579ac", fontSize: 36 }} />
        <Typography variant="h5">Uspaný účet</Typography>
        <HotelIcon sx={{ color: "#4579ac", fontSize: 36 }} />
      </div>
      <Divider />
      <Typography className="text-justify">
        Váš účet byl uspán administrátorem. Aktuálně nemůžete provádět žádné
        rezervace ani spravovat svůj účet. Pokud si myslíte, že se jedná o
        chybu, kontaktujte prosím administrátora.
      </Typography>
      <Divider />
      <Button variant="outlined">Kontaktovat administrátora</Button>
    </Paper>
  );
}
