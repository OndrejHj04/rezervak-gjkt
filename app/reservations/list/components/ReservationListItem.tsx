"use client";
import { store } from "@/store/store";
import { Reservation, ReservationStatus } from "@/types";
import AvatarWrapper from "@/ui-components/AvatarWrapper";
import {
  Avatar,
  Card,
  CardHeader,
  Checkbox,
  Chip,
  IconButton,
  Table,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
  createTheme,
} from "@mui/material";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

import { Icon } from "@mui/material";

export default function ReservationListItem({
  reservation,
}: {
  reservation: Reservation;
}) {
  const {
    selectedReservations,
    setSelectedReservations,
    reservationsStatus,
    reservationsSearch,
  } = store();

  const { push } = useRouter();
  const handleSelect = (e: any) => {
    e.stopPropagation();
    if (selectedReservations.includes(reservation.id)) {
      setSelectedReservations(
        selectedReservations.filter((id) => id !== reservation.id)
      );
    } else {
      setSelectedReservations([...selectedReservations, reservation.id]);
    }
  };

  return (
    <>
      <TableRow
        hover
        onClick={() => push(`/reservations/detail/${reservation.id}`)}
      >
        <TableCell>
          <Checkbox
            checked={selectedReservations.includes(reservation.id)}
            onClick={handleSelect}
          />
        </TableCell>
        <TableCell>
          <Typography>{reservation.name}</Typography>
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
        <TableCell>
          <Typography>{reservation.users.length}</Typography>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <AvatarWrapper data={reservation.leader as any} />
            <Typography>
              {reservation.leader.first_name} {reservation.leader.last_name}
            </Typography>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            {reservation.groups.map((group: any) => (
              <Chip key={group.id} label={group.name} />
            ))}
          </div>
        </TableCell>
        <TableCell>
          <Tooltip
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: "transparent",
                },
              },
            }}
            title={
              <Chip
                sx={{
                  backgroundColor: reservation.status.color,
                  color: "black",
                }}
                label={
                  <Typography>{reservation.status.display_name}</Typography>
                }
              />
            }
          >
            <IconButton onClick={(e) => e.stopPropagation()}>
              <Icon sx={{ color: reservation.status.color }}>
                {reservation.status.icon}
              </Icon>
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
    </>
  );
}
