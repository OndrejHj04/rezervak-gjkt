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
import React, { useState } from "react";
import { reservationDelete } from "@/lib/api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { dayjsExtended } from "@/lib/dayjsExtended";

export default function ReservationListItem({
  reservation,
  searchParams,
  allowModal
}: {
  reservation: any;
  searchParams: any
  allowModal: any
}) {
  const { reservation_id } = searchParams
  const { refresh } = useRouter()
  const blocation = reservation.status_id === 5
  const [anchorEl, setAnchorEl] = useState<any>(null)

  const handleDeleteReservations = () => {
    reservationDelete({ reservationId: reservation.id }).then((res) => {
      if (res.success) toast.success("Rezervace úspěšně odstraněny");
      else toast.error("Něco se pokazilo");
    });
    refresh()
  }

  const setMenuPosition = (e: any) => {
    setAnchorEl(
      anchorEl === null
        ? {
          mouseX: e.clientX + 2,
          mouseY: e.clientY - 6,
        }
        : null
    )
  }

  return (
    <React.Fragment>
      {allowModal && Number(reservation_id) === reservation.id && <ReservationModal reservation={reservation} />}
      <TableRow selected={Boolean(anchorEl)} onClick={setMenuPosition}>
        <TableCell>
          {reservation.name}
        </TableCell>
        <TableCell>
          {dayjsExtended(reservation.creation_date).format("DD. MMMM")}
        </TableCell>
        <TableCell>
          {dayjsExtended(reservation.from_date).format("DD. MMMM")}
        </TableCell>
        <TableCell>
          {dayjsExtended(reservation.to_date).format("DD. MMMM")}
        </TableCell>
        <TableCell>
          {reservation.users_count}
        </TableCell>
        <TableCell>
          <Typography>
            {reservation.active_registration ?
              <CheckCircle color="success" sx={{ width: 32, height: 32 }} />
              :
              <Cancel color="error" sx={{ width: 32, height: 32 }} />
            }
          </Typography>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            {reservation.leader_name && <React.Fragment>
              <AvatarWrapper data={{ image: reservation.leader_image }} />
              {reservation.leader_name}
            </React.Fragment>}
          </div>
        </TableCell>
        <TableCell>
          {reservation.beds_count}
        </TableCell>

        <TableCell>
          <Button className="!normal-case !text-inherit" onClick={e => e.stopPropagation()} {...(allowModal && !blocation && {
            component: Link, href: {
              href: '/reservation/list',
              query: { ...searchParams, reservation_id: reservation.id }
            }
          })}
          >
            <Icon sx={{ color: reservation.status_color }} className="mr-2">
              {reservation.status_icon}
            </Icon>
            {reservation.status_name}
          </Button>
        </TableCell>
        <TableCell align="right">
          {!blocation && <Link href={`/reservation/detail/${reservation.id}/info`} onClick={e => e.stopPropagation()}>
            <Button>detail</Button>
          </Link>
          }</TableCell>
      </TableRow>
      <Menu open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorReference="anchorPosition"
        anchorPosition={anchorEl !== null
          ? { top: anchorEl.mouseY, left: anchorEl.mouseX }
          : undefined}
      >
        <MenuItem onClick={handleDeleteReservations}>Odstrait rezervaci</MenuItem>
      </Menu>
    </React.Fragment >
  );
}
