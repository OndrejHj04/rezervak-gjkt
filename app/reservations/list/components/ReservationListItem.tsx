"use client";
import { store } from "@/store/store";
import { Reservation } from "@/types";
import AvatarWrapper from "@/ui-components/AvatarWrapper";
import {
  Avatar,
  Card,
  CardHeader,
  Checkbox,
  Chip,
  Table,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";

export default function ReservationListItem({
  reservation,
}: {
  reservation: Reservation;
}) {
  const { selectedReservations, setSelectedReservations } = store();

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
    <TableRow hover>
      <TableCell>
        <Checkbox
          checked={selectedReservations.includes(reservation.id)}
          onClick={handleSelect}
        />
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
          <AvatarWrapper data={reservation.leader} />
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
    </TableRow>
  );
}
