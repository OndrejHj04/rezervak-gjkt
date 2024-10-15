import AvatarWrapper from "@/ui-components/AvatarWrapper";
import {
  Avatar,
  CardHeader,
  Checkbox,
  Chip,
  Divider,
  Icon,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  TablePagination,
  Typography,
} from "@mui/material";
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot, TimelineOppositeContent } from "@mui/lab"
import FiberNewIcon from '@mui/icons-material/FiberNew';
import FolderDeleteIcon from '@mui/icons-material/FolderDelete';
import dayjs from "dayjs";
import TableListPagination from "@/ui-components/TableListPagination";
import { getReservationTimeline } from "@/lib/api";
import React from "react";
import { roomsEnum } from "@/app/constants/rooms";
import { Add, ArrowDownward, ArrowUpward, Remove } from "@mui/icons-material";
import TimelineEventUi from "./TimelineEventUi";


export default async function ReservationDetailDisplay({
  reservation,
  users,
  groups,
}: {
  reservation: any;
  users: any;
  groups: any;
}) {

  const reservationTimeline = await getReservationTimeline(reservation.id) as any
  console.log(reservationTimeline)
  return (
    <Paper className="md:p-4 p-2 flex gap-3 md:flex-row flex-col">
      <div>
        <Typography variant="h5">Název: {reservation.name}</Typography>
        <Divider />
        <Typography variant="h6">Vedoucí rezervace: </Typography>
        <CardHeader
          className="p-0 mb-2"
          avatar={<AvatarWrapper data={reservation.leader} size={56} />}
          title={
            <Typography variant="h5">
              {reservation.leader.first_name} {reservation.leader.last_name}
            </Typography>
          }
          subheader={reservation.leader.email}
        />
        <Typography variant="h6">
          Začátek rezervace: {dayjs(reservation.from_date).format("DD.MM.YYYY")}
        </Typography>
        <Typography variant="h6">
          Konec rezervace: {dayjs(reservation.to_date).format("DD.MM.YYYY")}
        </Typography>
        <Typography variant="h6">
          Datum vytvoření:{" "}
          {dayjs(reservation.creation_date).format("DD.MM.YYYY")}
        </Typography>
        <div className="flex gap-2">
          <Typography variant="h6">Status:</Typography>
          <Chip
            icon={
              <Icon sx={{ "&&": { color: reservation.status.color } }}>
                {reservation.status.icon}
              </Icon>
            }
            label={reservation.status.display_name}
          />
        </div>
        <Typography>Účel rezervace: {reservation.purpouse}</Typography>
        <Typography>
          Pokyny pro účastníky: {reservation.instructions}
        </Typography>
      </div>
      <Divider orientation="vertical" flexItem />
      <div className="flex md:flex-row flex-col gap-3">
        <div className="flex flex-col">
          <Typography variant="h5">Uživatelé v rezervaci</Typography>
          <Divider />
          <List>
            {reservation.users.data.length ? (
              reservation.users.data.map((user: any) => (
                <ListItem disablePadding key={user.id}>
                  <ListItemIcon>
                    <AvatarWrapper data={user} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography>
                        {user.first_name} {user.last_name}
                      </Typography>
                    }
                    secondary={user.email}
                  />
                </ListItem>
              ))
            ) : (
              <>
                <Typography>Žádní uživatelé v rezervaci</Typography>
              </>
            )}
          </List>
          <div className="mt-auto">
            <TableListPagination
              count={reservation.users.count}
              name="users"
              rpp={5}
            />
          </div>
        </div>
        <Divider orientation="vertical" flexItem />
        <div className="flex flex-col">
          <Typography variant="h5">Skupiny v rezervaci</Typography>
          <Divider />
          <List>
            {reservation.groups.data.length ? (
              reservation.groups.data.map((group: any) => (
                <ListItem disablePadding key={group.id}>
                  <ListItemText
                    primary={group.name}
                    secondary={"Počet členů: " + group.users.length}
                  />
                </ListItem>
              ))
            ) : (
              <>
                <Typography>Žádné skupiny v rezervaci</Typography>
              </>
            )}
          </List>
          <div className="mt-auto">
            <TableListPagination
              name="group"
              rpp={5}
              count={reservation.groups.count}
            />
          </div>
        </div>
        <Divider flexItem orientation="vertical" />
        <div className="flex flex-col">
          <Typography variant="h5">Pokoje</Typography>
          <Divider />
          <List>
            {roomsEnum.list.map((room) => {
              if (reservation.rooms.includes(room.id)) {
                return (
                  <ListItem key={room.id} disablePadding>
                    <ListItemText primary={room.label} secondary={`Počet lůžek ${room.capacity}`} />
                  </ListItem>
                )
              }
            })}
          </List>
        </div>
        <Divider flexItem orientation="vertical" />
        <div className="flex flex-col">
          <Typography variant="h5">Timeline</Typography>
          <Divider />
          <Timeline className="!px-0 [&_.MuiTimelineItem-root:last-child_.MuiTimelineConnector-root]:hidden">
            {reservationTimeline.data.map((item: any, i: any) => (
              <TimelineItem key={item.timestamp} className="before:[&]:hidden">
                <TimelineOppositeContent className="h-[54.5px] flex items-center">
                  <ListItemText primary={<Typography noWrap>
                    {dayjs(item.timestamp).format("DD. MM. HH:mm")}
                  </Typography>} secondary={"Placeholder"} />
                </TimelineOppositeContent>
                {TimelineEventUi(item.timelineEventTypeId)}
              </TimelineItem>
            ))}
          </Timeline>
        </div>
      </div>
    </Paper >
  );
}
