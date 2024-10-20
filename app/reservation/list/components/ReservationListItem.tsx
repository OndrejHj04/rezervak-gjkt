import AvatarWrapper from "@/ui-components/AvatarWrapper";
import {
  Badge,
  Button,
  Chip,
  IconButton,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import GroupIcon from "@mui/icons-material/Group";
import { Icon } from "@mui/material";
import Link from "next/link";
import TableListCheckbox from "@/ui-components/TableListCheckbox";
import { rolesConfig } from "@/lib/rolesConfig";
import ReservationModal from "./ReservationModal";
import NightShelterIcon from "@mui/icons-material/NightShelter";
import HotelIcon from "@mui/icons-material/Hotel";

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

  return (
    <>
      <ReservationModal reservation={reservation} />
      <TableRow>
        {rolesConfig.reservations.modules.reservationsTable.config.delete.includes(
          userRole
        ) && <TableListCheckbox prop="reservations" id={reservation.id} />}

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
            <Link href={`/reservation/detail/${reservation.id}`}>
              <Button>detail</Button>
            </Link>
          </TableCell>
        ) : (
          <TableCell />
        )}
      </TableRow>
    </>
  );
}
