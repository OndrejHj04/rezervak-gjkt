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
        <List>
          {reservation.users.data.map((user: any) => (
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
          ))}
        </List>
        <UsersPagination count={reservation.users.count} />
      </div>
      <div>
        <Typography variant="h5">Skupiny v rezervaci</Typography>
        <Divider />
        <List>
          {reservation.groups.data.map((group: any) => (
            <ListItem disablePadding key={group.id}>
              <ListItemIcon>
                <Avatar />
              </ListItemIcon>
              <ListItemText
                primary={group.name}
                secondary={"Počet členů: " + group.users.length}
              />
            </ListItem>
          ))}
        </List>
        <GroupsPagination count={reservation.groups.count} />
      </div>
    </Paper>
  );
}
