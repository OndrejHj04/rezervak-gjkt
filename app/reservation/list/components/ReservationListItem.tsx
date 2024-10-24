"use client"

import AvatarWrapper from "@/ui-components/AvatarWrapper";
import {
  Badge,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import GroupIcon from "@mui/icons-material/Group";
import { Icon } from "@mui/material";
import Link from "next/link";
import { rolesConfig } from "@/lib/rolesConfig";
import ReservationModal from "./ReservationModal";
import NightShelterIcon from "@mui/icons-material/NightShelter";
import HotelIcon from "@mui/icons-material/Hotel";
import { Cancel, CheckCircle } from "@mui/icons-material";
import { store } from "@/store/store";
import React, { useRef, useState } from "react";
import { reservationsDelete } from "@/lib/api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function ReservationListItem({
  reservation,
  userRole,
  userId,
  searchParams
}: {
  reservation: any;
  userRole: any;
  userId: any;
  searchParams: any
}) {
  const isMember = reservation.users.includes(userId);
  const isLeader = reservation.leader.id === userId;
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
          <Typography>{reservation.users.length}</Typography>
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
            <Typography>
              {reservation.leader.first_name} {reservation.leader.last_name}
            </Typography>
          </div>
        </TableCell>
        <TableCell>
          {!!reservation.rooms.length && (
            <Tooltip
              title={reservation.rooms.map((room: any) => (
                <Chip
                  key={room.id}
                  label={`Pokoj č. ${room.id}, ${room.people} lůžkový`}
                />
              ))}
            >
              <div className="flex justify-around">
                <Badge badgeContent={reservation.rooms.length} color="primary">
                  <NightShelterIcon color="primary" fontSize="large" />
                </Badge>
                <Badge
                  badgeContent={reservation.rooms.reduce(
                    (a: any, b: any) => a + b.people,
                    0
                  )}
                  color="primary"
                >
                  <HotelIcon color="primary" fontSize="large" />
                </Badge>
              </div>
            </Tooltip>
          )}
        </TableCell>
        <TableCell>
          {!!reservation.groups.length && (
            <Tooltip
              title={reservation.groups.map((group: any) => (
                <Chip key={group} label={group} />
              ))}
            >
              <Badge badgeContent={reservation.groups.length} color="primary">
                <GroupIcon color="primary" />
              </Badge>
            </Tooltip>
          )}
        </TableCell>
        <TableCell>
          <Tooltip
            slotProps={{
              tooltip: {
                sx: {
                  bgcolor: "transparent",
                },
              }
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
            <Link
              href={{
                href: '/reservation/list',
                query: { ...searchParams, reservation_id: reservation.id }
              }}
              className={
                !rolesConfig.reservations.modules.reservationsTable.config.changeStatus.includes(
                  userRole
                )
                  ? "pointer-events-none"
                  : ""
              }
            >
              <IconButton>
                <Icon sx={{ color: reservation.status.color }}>
                  {reservation.status.icon}
                </Icon>
              </IconButton>
            </Link>
          </Tooltip>
        </TableCell>
        <TableCell>
          <Typography>
            {dayjs(reservation.creation_date).format("DD. MM. YYYY")}
          </Typography>
        </TableCell>
        {(rolesConfig.reservations.modules.reservationsDetail.visit.includes(
          userRole
        ) ||
          isLeader ||
          (isMember &&
            rolesConfig.reservations.modules.reservationsDetail.visitSelf.includes(
              userRole
            ))) &&
          reservation.status.id !== 5 ? (
          <TableCell>
            <Link href={`/reservation/detail/${reservation.id}`} onClick={e => e.stopPropagation()}>
              <Button>detail</Button>
            </Link>
          </TableCell>
        ) : (
          <TableCell />
        )}
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
    </React.Fragment>
  );
}
