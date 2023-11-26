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
import PerfectScrollbar from "react-perfect-scrollbar";
import Pagination from "./Pagination";

export default function ReservationDetailDisplay({
  reservation,
}: {
  reservation: any;
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
          {reservation.users.length ? (
            reservation.users.map((user: any) => (
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
              <Typography>Žádní uživatelé ve rezervaci</Typography>
            </>
          )}
        </List>
        <Pagination />
      </div>
      <div>
        <Typography variant="h5">Skupiny v rezervaci</Typography>
        <Divider />
        <List>
          {reservation.groups.length ? (
            reservation.groups.map((group: any) => (
              <ListItem disablePadding key={group.id}>
                <ListItemIcon>
                  <Avatar />
                </ListItemIcon>
                <ListItemText
                  primary={group.name}
                  secondary={"Počet členů: " + group.users.length}
                />
              </ListItem>
            ))
          ) : (
            <>
              <Typography>Žádné skuiny v rezervaci</Typography>
            </>
          )}
        </List>
      </div>
    </Paper>
  );
}
