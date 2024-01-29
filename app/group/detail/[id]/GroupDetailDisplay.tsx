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
import GroupsPagination from "./GroupsPagination";
import UsersPagination from "@/app/reservation/detail/[id]/UsersPagination";

export default async function GroupDetailDisplay({ group }: { group: any }) {
  return (
    <Paper className="md:p-4 p-2 flex md:flex-row flex-col gap-4">
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
      <div className="flex md:flex-row flex-col gap-3">
        <div className="flex flex-col">
          <Typography variant="h5">Uživatelé ve skupině </Typography>
          <Divider />
          <List>
            {group.users.count ? (
              group.users.data.map((user: any) => (
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
          <div className="mt-auto">
            <UsersPagination count={group.users.count} />
          </div>
        </div>
        <div className="flex flex-col">
          <Typography variant="h5">Rezervace skupiny </Typography>
          <Divider />
          <List>
            {group.reservations.count ? (
              group.reservations.data.map((reservation: any) => (
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
                <Typography>Žádné rezervace skupiny</Typography>
              </>
            )}
          </List>
          <div className="mt-auto">
            <GroupsPagination count={group.reservations.count} />
          </div>
        </div>
      </div>
    </Paper>
  );
}
