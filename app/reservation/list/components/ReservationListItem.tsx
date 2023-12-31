import { Reservation } from "@/types";
import AvatarWrapper from "@/ui-components/AvatarWrapper";
import {
  Badge,
  Button,
  Checkbox,
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
import { rolesConfig } from "@/rolesConfig";

export default function ReservationListItem({
  reservation,
  userRole,
  userId,
}: {
  reservation: Reservation;
  userRole: any;
  userId: any;
}) {
  const isMember = reservation.users.includes(userId);
  return (
    <>
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
          {!!reservation.groups.length && (
            <Tooltip
              title={reservation.groups.map((group: any) => (
                <Chip key={group.id} label={group.name} />
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
            <IconButton>
              <Icon sx={{ color: reservation.status.color }}>
                {reservation.status.icon}
              </Icon>
            </IconButton>
          </Tooltip>
        </TableCell>
        {rolesConfig.reservations.modules.reservationsDetail.visit.includes(
          userRole
        ) ||
        (isMember &&
          rolesConfig.reservations.modules.reservationsDetail.visitSelf.includes(
            userRole
          )) ? (
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
