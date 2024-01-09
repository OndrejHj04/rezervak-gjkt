import { Reservation } from "@/types";
import { Avatar, CardHeader, Icon, MenuItem, Typography } from "@mui/material";
import dayjs from "dayjs";
import Link from "next/link";

export default function SingleReservation({
  reservations,
}: {
  reservations: Reservation;
}) {
  return (
    <Link
      href={`/reservation/detail/${reservations.id}`}
      className="no-underline text-inherit"
    >
      <MenuItem className="flex justify-between gap-2">
        <Typography>{reservations.name}</Typography>
        <Icon sx={{ color: reservations.status.color }}>
          {reservations.status.icon}
        </Icon>
        <Typography color="text.secondary" sx={{ fontSize: 14 }}>{`${dayjs(
          reservations.from_date
        ).format("DD.MM.YYYY")} - ${dayjs(reservations.to_date).format(
          "DD.MM.YYYY"
        )}`}</Typography>
      </MenuItem>
    </Link>
  );
}
