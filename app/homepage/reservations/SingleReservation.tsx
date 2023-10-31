"use client";

import { Reservation } from "@/types";
import { Avatar, CardHeader, MenuItem } from "@mui/material";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

export default function SingleReservation({
  resevation,
}: {
  resevation: Reservation;
}) {
  const { push } = useRouter();
  return (
    <MenuItem
      className="p-0"
      onClick={() => push(`/reservations/detail/${resevation.id}`)}
    >
      <CardHeader
        avatar={<Avatar></Avatar>}
        title={resevation.name}
        subheader={`${dayjs(resevation.from_date).format(
          "DD.MM.YYYY"
        )} - ${dayjs(resevation.to_date).format("DD.MM.YYYY")}`}
      />
    </MenuItem>
  );
}
