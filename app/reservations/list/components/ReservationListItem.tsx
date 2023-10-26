import { Reservation } from "@/types";
import { Checkbox, TableCell, TableRow, Typography } from "@mui/material";
import dayjs from "dayjs";

export default function ReservationListItem({
  reservation,
}: {
  reservation: Reservation;
}) {
  return (
    <TableRow hover>
      <TableCell>
        <Checkbox />
      </TableCell>
      <TableCell>
        <Typography>
          {dayjs(reservation.from_date).format("DD. MM. YYYY")}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography>
          {dayjs(reservation.to_date).format("DD. MM. YYYY")}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography>{reservation.purpouse}</Typography>
      </TableCell>
    </TableRow>
  );
}
