import { Reservation } from "@/types";
import { Avatar, CardHeader, MenuItem } from "@mui/material";
import dayjs from "dayjs";
import Link from "next/link";

export default function SingleReservation({
  reservations,
}: {
  reservations: Reservation;
}) {
  return (
    <Link
      href={`/reservations/detail/${reservations.id}`}
      className="no-underline text-inherit"
    >
      <MenuItem className="p-0">
        <CardHeader
          avatar={<Avatar></Avatar>}
          title={reservations.name}
          subheader={`${dayjs(reservations.from_date).format(
            "DD.MM.YYYY"
          )} - ${dayjs(reservations.to_date).format("DD.MM.YYYY")}`}
        />
      </MenuItem>
    </Link>
  );
}
