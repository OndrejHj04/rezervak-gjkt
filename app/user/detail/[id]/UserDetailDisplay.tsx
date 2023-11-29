import AvatarWrapper from "@/ui-components/AvatarWrapper";
import {
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";

export default function UserDetailDisplay({ userDetail }: { userDetail: any }) {
  return (
    <Paper className="p-4 flex gap-4">
      <div className="flex flex-col">
        <CardHeader
          className="p-0 mb-2"
          avatar={<AvatarWrapper data={userDetail} size={56} />}
          title={
            <Typography variant="h5">
              {userDetail.first_name} {userDetail.last_name}
            </Typography>
          }
          subheader={userDetail.email}
        />

        <Typography variant="h6">
          Datum narození: {dayjs(userDetail.birth_date).format("DD. MM. YYYY")}
        </Typography>
        <Typography>Číslo OP: {userDetail.ID_code}</Typography>
        <Typography>Role: {userDetail.role.role_name}</Typography>
        <Typography>Adresa: {userDetail.adress}</Typography>
      </div>
      <div>
        <Typography variant="h5">
          Skupiny uživatele{" "}
          {!!userDetail.groups && <span>({userDetail.groups.length})</span>}
        </Typography>
        <Divider />
        <List sx={{ height: 400 }}>
          {userDetail.groups ? (
            userDetail.groups.map((group: any) => (
              <ListItem disablePadding key={group.id}>
                <ListItemText
                  primary={<Typography>{group.name}</Typography>}
                  secondary={`Počet členů: ${group.users.length}`}
                />
              </ListItem>
            ))
          ) : (
            <>
              <Typography>Žádní skupiny uživatele</Typography>
            </>
          )}
        </List>
      </div>
      <div>
        <Typography variant="h5">
          Rezervace uživatele{" "}
          {!!userDetail.reservations && (
            <span>({userDetail.reservations.length})</span>
          )}
        </Typography>
        <Divider />
        <List sx={{ height: 400 }}>
          {userDetail.reservations ? (
            userDetail.reservations.map((reservation: any) => (
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
              <Typography>Žádní uživatelé ve skupině</Typography>
            </>
          )}
        </List>
      </div>
    </Paper>
  );
}
