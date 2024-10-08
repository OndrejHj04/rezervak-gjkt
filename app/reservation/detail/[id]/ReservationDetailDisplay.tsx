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

export default async function ReservationDetailDisplay({
  reservation,
  users,
  groups,
}: {
  reservation: any;
  users: any;
  groups: any;
}) {

  const { data: timelineData } = await getReservationTimeline(reservation.id)

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
        <Typography>Pokoje: </Typography>
        <div className="flex gap-2 flex-col">
          {reservation.rooms.map((room: any) => (
            <Chip
              className="w-min"
              key={room.id}
              label={`Pokoj č. ${room.id}, ${room.people} lůžkový`}
            />
          ))}
        </div>
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
        <div>
          <Typography variant="h5">Timeline rezervace</Typography>
          <Divider />

          <Timeline>
            {timelineData.map((action: any, i) => (
              <TimelineItem key={i} className="before:[&]:hidden">
                <TimelineOppositeContent color="text.secondary">
                  {action.timestamp && <Typography noWrap>{dayjs(action.timestamp).format("DD. MM. YYYY")}</Typography>}
                  {action.range && <React.Fragment>
                    <Typography noWrap>
                      {dayjs(action.range[0]).format("DD. MM. YYYY")}
                    </Typography>
                    <Typography noWrap>
                      {dayjs(action.range[1]).format("DD. MM. YYYY")}
                    </Typography>
                  </React.Fragment>}
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot />
                  {timelineData.length - 1 !== i && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent>
                  {action.action}
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>        </div>
      </div>
    </Paper >
  );
}
