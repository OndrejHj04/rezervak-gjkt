import { Reservation } from "@/types";
import {
  Avatar,
  CardHeader,
  Chip,
  Icon,
  MenuItem,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import Link from "next/link";

export default function SingleReservation({
  reservations,
  display,
  link,
}: {
  reservations: Reservation;
  display?: any;
  link?: any;
}) {
  return (
    <Link
      href={`/reservation/detail/${reservations.id}`}
      className="no-underline text-inherit"
      style={{
        pointerEvents: link ? "auto" : "none",
      }}
    >
      <MenuItem className="flex justify-between gap-2">
        <Typography>{reservations.name}</Typography>
        {display === "long" ? (
          <Chip
            icon={
              <Icon sx={{ color: reservations.status.color }}>
                {reservations.status.icon}
              </Icon>
            }
            label={<Typography>{reservations.status.display_name}</Typography>}
          />
        ) : (
          <Icon sx={{ color: reservations.status.color }}>
            {reservations.status.icon}
          </Icon>
        )}
        <Typography>{reservations.rooms.length} pokojů</Typography>
        <Typography color="text.secondary" sx={{ fontSize: 14 }}>{`${dayjs(
          reservations.from_date
        ).format("DD.MM.")} - ${dayjs(reservations.to_date).format(
          "DD.MM."
        )}`}</Typography>
      </MenuItem>
    </Link>
  );
}
