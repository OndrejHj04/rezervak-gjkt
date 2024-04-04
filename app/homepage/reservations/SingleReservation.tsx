import { Reservation } from "@/types";
import {
  Avatar,
  CardHeader,
  Chip,
  Icon,
  ListItemText,
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
        pointerEvents: link === "no-link" ? "none" : "auto",
      }}
    >
      <MenuItem className="flex justify-between gap-1 px-1">
        <Typography noWrap>{reservations.name}</Typography>
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
        <Typography>{reservations.rooms.length} pok.</Typography>
        <Typography color="text.secondary" sx={{ fontSize: 14 }}>{`${dayjs(
          reservations.from_date
        ).format("DD.MM.")} - ${dayjs(reservations.to_date).format(
          "DD.MM."
        )}`}</Typography>
      </MenuItem>
    </Link>
  );
}
