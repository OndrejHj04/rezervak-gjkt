"use client";

import { Reservation } from "@/types";
import { Avatar, CardHeader, MenuItem } from "@mui/material";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

export default function SingleReservation({
  reservations,
}: {
  reservations: Reservation;
}) {
  const { push } = useRouter();
  return (
    <MenuItem
      className="p-0"
      onClick={() => push(`/reservations/detail/${reservations.id}`)}
    >
      <CardHeader
        avatar={<Avatar></Avatar>}
        title={reservations.name}
        subheader={`${dayjs(reservations.from_date).format(
          "DD.MM.YYYY"
        )} - ${dayjs(reservations.to_date).format("DD.MM.YYYY")}`}
      />
    </MenuItem>
  );
}
