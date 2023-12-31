import AvatarWrapper from "@/ui-components/AvatarWrapper";
import {
  Avatar,
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
import dayjs from "dayjs";
import Pagination from "./UsersPagination";
import UsersPagination from "./UsersPagination";
import GroupsPagination from "./GroupsPagination";

export default function ReservationDetailDisplay({
  reservation,
  users,
  groups,
}: {
  reservation: any;
  users: any;
  groups: any;
}) {
  return (
    <Paper className="p-4 flex gap-4">
      <div>
        <Typography variant="h5">Název: {reservation.name}</Typography>
        <Divider />
        <Typography variant="h6">Vedoucí rezervace: </Typography>

        <div className="flex gap-2">
          <AvatarWrapper size={56} data={reservation.leader as any} />
          <div className="flex flex-col">
            <Typography variant="h6" className="font-semibold">
              {reservation.leader.first_name} {reservation.leader.last_name}
            </Typography>
            <Typography>{reservation.leader.email}</Typography>
          </div>
        </div>
        <Typography variant="h6">
          Začátek rezervace: {dayjs(reservation.from_date).format("DD.MM.YYYY")}
        </Typography>
        <Typography variant="h6">
          Konec rezervace: {dayjs(reservation.to_date).format("DD.MM.YYYY")}
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
        <Typography>Počet pokojů: {reservation.rooms}</Typography>
        <Typography>
          Pokyny pro účastníky: {reservation.instructions}
        </Typography>
      </div>
      <div>
        <Typography variant="h5">Uživatelé v rezervaci</Typography>
        <Divider />
        <List sx={{ height: 300 }}>
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
        <UsersPagination count={reservation.users.count} />
      </div>
      <div>
        <Typography variant="h5">Skupiny v rezervaci</Typography>
        <Divider />
        <List sx={{ height: 300 }}>
          {reservation.groups.data.length ? (
            reservation.groups.data.map((group: any) => (
              <ListItem disablePadding key={group.id}>
                <ListItemText
                  primary={group.name}
                  secondary={"Počet členů: " + JSON.parse(group.users).length}
                />
              </ListItem>
            ))
          ) : (
            <>
              <Typography>Žádné skupiny v rezervaci</Typography>
            </>
          )}
        </List>
        <GroupsPagination count={reservation.groups.count} />
      </div>
    </Paper>
  );
}
