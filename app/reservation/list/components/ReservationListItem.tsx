"use client"

import AvatarWrapper from "@/ui-components/AvatarWrapper";
import {
  Button,
  Menu,
  MenuItem,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { Icon } from "@mui/material";
import Link from "next/link";
import ReservationModal from "./ReservationModal";
import { Cancel, CheckCircle } from "@mui/icons-material";
import { store } from "@/store/store";
import React, { useState } from "react";
import { reservationsDelete } from "@/lib/api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function ReservationListItem({
  reservation,
  searchParams
}: {
  reservation: any;
  searchParams: any
}) {
  const { refresh } = useRouter()

  const [contextMenu, setContextMenu] = useState<any>(null)
  const { selectedReservations, setSelectedReservations } = store()

  const handleSelectReservation = () => {
    if (selectedReservations.includes(reservation.id)) {
      setSelectedReservations(selectedReservations.filter((res: any) => res !== reservation.id))
    } else {
      setSelectedReservations([...selectedReservations, reservation.id])
    }
  }

  const handleDeleteReservations = () => {
    reservationsDelete({ reservations: selectedReservations }).then((res) => {
      if (res.success) toast.success("Rezervace úspěšně odstraněny");
      else toast.error("Něco se pokazilo");
    });
    refresh()
    setSelectedReservations([]);
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setContextMenu(
      contextMenu === null && selectedReservations.includes(reservation.id)
        ? {
          mouseX: e.clientX + 2,
          mouseY: e.clientY - 6,
        }
        : null,
    );
  };

  const handleClose = () => {
    setContextMenu(null);
  }

  return (
    <React.Fragment>
      <ReservationModal reservation={reservation} />
      <TableRow onContextMenu={handleContextMenu} selected={selectedReservations.includes(reservation.id)} onClick={handleSelectReservation}>
        <TableCell>
          {reservation.name}
        </TableCell>
        <TableCell>
          {dayjs(reservation.creation_date).format("DD. MMMM")}
        </TableCell>
        <TableCell>
          {dayjs(reservation.from_date).format("DD. MMMM YYYY")}
        </TableCell>
        <TableCell>
          {dayjs(reservation.to_date).format("DD. MMMM. YYYY")}
        </TableCell>
        <TableCell>
          {reservation.users.length}
        </TableCell>
        <TableCell>
          <Typography>
            {reservation.form.active ?
              <CheckCircle color="success" sx={{ width: 32, height: 32 }} />
              :
              <Cancel color="error" sx={{ width: 32, height: 32 }} />
            }
          </Typography>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <AvatarWrapper data={reservation.leader as any} />
            {reservation.leader.first_name} {reservation.leader.last_name}
          </div>
        </TableCell>
        <TableCell>
          {reservation.rooms.reduce((a: any, b: any) => a + b.people, 0)}
        </TableCell>

        <TableCell>
          <Button className="!normal-case !text-inherit" onClick={e => e.stopPropagation()} component={Link} href={{
            href: '/reservation/list',
            query: { ...searchParams, reservation_id: reservation.id }
          } as any}
          >
            <Icon sx={{ color: reservation.status.color }} className="mr-2">
              {reservation.status.icon}
            </Icon>
            {reservation.status.display_name}
          </Button>
        </TableCell>
        <TableCell align="right">
          <Link href={`/reservation/detail/${reservation.id}`} onClick={e => e.stopPropagation()}>
            <Button>detail</Button>
          </Link>
        </TableCell>
      </TableRow>
      <Menu open={Boolean(contextMenu)}
        onClose={handleClose}
        className="[&_.MuiList-root]:!p-0"
        anchorReference="anchorPosition"
        anchorPosition={contextMenu !== null
          ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
          : undefined}
      >
        <MenuItem onClick={handleDeleteReservations}>Odstranit vybrané</MenuItem>
      </Menu>
    </React.Fragment >
  );
}
