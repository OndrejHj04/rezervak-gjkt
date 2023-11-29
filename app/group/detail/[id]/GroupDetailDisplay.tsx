import AvatarWrapper from "@/ui-components/AvatarWrapper";
import {
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";

export default async function GroupDetailDisplay({ group }: { group: any }) {
  return (
    <Paper className="flex p-4 gap-4">
      <div>
        <Typography variant="h5">Jméno: {group.name}</Typography>
        <Typography variant="h6">Popis skupiny: {group.description}</Typography>
        <div>
          <Typography variant="h6">Vedoucí skupiny</Typography>
          <div className="flex gap-2">
            <AvatarWrapper size={56} data={group.owner as any} />
            <div className="flex flex-col">
              <Typography variant="h6" className="font-semibold">
                {group.owner.first_name} {group.owner.last_name}
              </Typography>
              <Typography>{group.owner.email}</Typography>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <div className="flex flex-col">
          <Typography variant="h5">
            Uživatelé ve skupině{" "}
            {!!group.users.length && <span>({group.users.length})</span>}
          </Typography>
          <Divider />
          <List>
            {group.users.length ? (
              group.users.map((user: any) => (
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
                <Typography>Žádní uživatelé ve skupině</Typography>
              </>
            )}
          </List>
        </div>
        <div className="flex flex-col">
          <Typography variant="h5">
            Rezervace skupiny{" "}
            {!!group.reservations.length && (
              <span>({group.reservations.length})</span>
            )}
          </Typography>
          <Divider />
          <List>
            {group.reservations.length ? (
              group.reservations.map((reservation: any) => (
                <ListItem disablePadding key={reservation.id}>
                  <ListItemText
                    primary={<Typography>{reservation.name}</Typography>}
                    secondary={`${dayjs(reservation.from_date).format(
                      "DD.MM.YYYY"
                    )} - ${dayjs(reservation.to_date).format("DD.MM.YYYY")}`}
                  />
                </ListItem>
              ))
            ) : (
              <>
                <Typography>Žádní rezervace skupiny</Typography>
              </>
            )}
          </List>
        </div>
      </div>
    </Paper>
  );
}
