import { Box, Divider, Paper, Typography } from "@mui/material";
import HotelIcon from "@mui/icons-material/Hotel";

export default function UserSleepAnnouncment({ data }: { data: any }) {
  return (
    <>
      <div className="absolute z-50">
        <Paper className="p-4 flex flex-col gap-2 max-w-sm">
          <Box className="flex justify-between items-center gap-5">
            <HotelIcon sx={{ color: "#4579ac", fontSize: 36 }} />
            <Typography variant="h5">Pššš! Tento účet spí</Typography>
            <HotelIcon sx={{ color: "#4579ac", fontSize: 36 }} />
          </Box>

          <Typography variant="h6" className="text-center">
            Uživatel: {data.first_name} {data.last_name}
          </Typography>
          <Divider />
          <Typography className="text-justify">
            Tato akce byla vyvolána administrátorem.
          </Typography>
        </Paper>
      </div>
      <Box sx={{ filter: "blur(5px)", pointerEvents: "none" }}>{<></>}</Box>
    </>
  );
}
