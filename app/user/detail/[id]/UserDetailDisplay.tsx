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
import TableListPagination from "@/ui-components/TableListPagination";

export default function UserDetailDisplay({ userDetail }: { userDetail: any }) {
  return (
    <Paper className="md:p-4 p-2 flex md:flex-row flex-col gap-4">
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
          Datum narození:{" "}
          {userDetail.birth_date &&
            dayjs(userDetail.birth_date).format("DD. MM. YYYY")}
        </Typography>
        <Typography>Rodné číslo: {userDetail.ID_code}</Typography>
        <Typography>Role: {userDetail.role.name}</Typography>
        <Typography>Adresa: {userDetail.adress}</Typography>
      </div>

      <div className="flex md:flex-row flex-col gap-3">
        <div className="flex flex-col">
          <Typography variant="h5">Skupiny uživatele </Typography>
          <Divider />
          <List>
            {userDetail.groups.count ? (
              userDetail.groups.data.map((group: any) => (
                <ListItem disablePadding key={group.id}>
                  <ListItemText
                    primary={<Typography>{group.name}</Typography>}
                    secondary={`Počet členů: ${group.users.length}`}
                  />
                </ListItem>
              ))
            ) : (
              <>
                <Typography>Žádné skupiny uživatele</Typography>
              </>
            )}
          </List>
          <div className="mt-auto">
            <TableListPagination name="groups" rpp={5} count={userDetail.groups.count} />
          </div>
        </div>
        <div className="flex flex-col">
          <Typography variant="h5">Rezervace uživatele</Typography>
          <Divider />
          <List>
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
          <div className="mt-auto">
            <TableListPagination
              name="reservations"
              rpp={5}
              count={userDetail.reservations.count}
            />
          </div>
        </div>
      </div>
    </Paper>
  );
}
