import {
  MenuItem,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import Link from "next/link";

export default function SingleReservation({
  reservations,
}: {
  reservations: any;
}) {
  return (
    <Link
      href={`/reservation/detail/${reservations.id}`}
      className="no-underline text-inherit"
    >
      <MenuItem className="flex !justify-between gap-2 px-1">
        <Typography noWrap>{reservations.name}</Typography>
        <Typography color="text.secondary" sx={{ fontSize: 14 }}>{`Datum: ${dayjs(
          reservations.from_date
        ).format("DD.MM.")} - ${dayjs(reservations.to_date).format(
          "DD.MM."
        )}`}</Typography>
      </MenuItem>
    </Link>
  );
}
