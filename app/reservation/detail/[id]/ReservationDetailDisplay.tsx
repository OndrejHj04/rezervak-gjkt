import AvatarWrapper from "@/ui-components/AvatarWrapper";
import {
  CardHeader,
  Chip,
  Divider,
  Icon,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { Timeline, TimelineItem, TimelineOppositeContent } from "@mui/lab"
import dayjs from "dayjs";
import TableListPagination from "@/ui-components/TableListPagination";
import { getReservationTimeline } from "@/lib/api";
import React from "react";
import { roomsEnum } from "@/app/constants/rooms";
import TimelineEventUi from "./TimelineEventUi";
import { smartTime } from "@/app/constants/smartTime";
import TimelineToggle from "./TimelineToggle";


export default async function ReservationDetailDisplay({
  reservation,
  timeline = 1,
  timelineDisplay = "new"
}: {
  reservation: any;
  timeline: any
  timelineDisplay: any
}) {

  const reservationTimeline = await getReservationTimeline({ reservationId: reservation.id, mode: timelineDisplay }) as any
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
          <div className="flex items-center justify-between">
            <Typography variant="h5">Timeline</Typography>
            <TimelineToggle />
          </div>
          <Divider />
          <Timeline className="!px-0 [&_.MuiTimelineItem-root:last-child_.MuiTimelineConnector-root]:hidden [&_.MuiTimelineOppositeContent-root]:!pl-0 [&_.MuiTimelineOppositeContent-root]:[flex:_0.5] [&_.MuiTimelineContent-root]:!pr-0 [&_.MuiTimelineOppositeContent-root]:mr-0 w-[400px]">
            {reservationTimeline.data.slice(timeline * 5 - 5, timeline * 5).map(({ dateFormat = "DD. MM. HH:mm", ...rest }: any, i: any) => (
              <TimelineItem key={i} className="before:[&]:hidden" >
                <TimelineOppositeContent className="">
                  <ListItemText className="my-0" primary={smartTime(rest.timestamp)} secondaryTypographyProps={{ className: "whitespace-nowrap" }} secondary={dayjs(rest.timestamp).format(dateFormat)} />
                </TimelineOppositeContent>
                {TimelineEventUi(rest)}
              </TimelineItem>
            ))}
          </Timeline>
          <TableListPagination count={reservationTimeline.count} name="timeline" rpp={5} />
        </div>
      </div>
    </Paper >
  );
}
