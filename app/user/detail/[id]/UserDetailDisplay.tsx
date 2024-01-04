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
import GroupsPagination from "./GroupsPagination";
import ReservationsPagination from "./ReservationsPagination";

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
        <Typography>Role: {userDetail.role.name}</Typography>
        <Typography>Adresa: {userDetail.adress}</Typography>
      </div>
      <div>
        <Typography variant="h5">Skupiny uživatele </Typography>
        <Divider />
        <List sx={{ height: 400 }}>
          {userDetail.groups.count ? (
            userDetail.groups.data.map((group: any) => (
              <ListItem disablePadding key={group.id}>
                <ListItemText
                  primary={<Typography>{group.name}</Typography>}
                  secondary={`Počet členů: ${JSON.parse(group.users).length}`}
                />
              </ListItem>
            ))
          ) : (
            <>
              <Typography>Žádné skupiny uživatele</Typography>
            </>
          )}
        </List>
        <GroupsPagination count={userDetail.groups.count} />
      </div>
      <div>
        <Typography variant="h5">Rezervace uživatele</Typography>
        <Divider />
        <List sx={{ height: 400 }}>
          {userDetail.reservations.count ? (
            userDetail.reservations.data.map((reservation: any) => (
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
              <Typography>Žádné rezervace uživatele</Typography>
            </>
          )}
        </List>
        <ReservationsPagination count={userDetail.reservations.count} />
      </div>
    </Paper>
  );
}
