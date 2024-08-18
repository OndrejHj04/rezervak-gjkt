import AvatarWrapper from "@/ui-components/AvatarWrapper";
import {
  Alert,
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
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import HotelIcon from "@mui/icons-material/Hotel";

export default function UserDetailDisplay({ userDetail }: { userDetail: any }) {
  console.log(userDetail.reservations);
  return (
    <Paper className="md:p-4 p-2 flex md:flex-row flex-col gap-3">
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
        <Typography>Číslo OP: {userDetail.ID_code}</Typography>
        <Typography>Role: {userDetail.role.name}</Typography>
        <Typography>Adresa: {userDetail.adress}</Typography>

        <div className="flex flex-col gap-2">
          {!userDetail.active ? (
            <Alert variant="outlined" severity="info" icon={<HotelIcon />}>
              Účet byl uspán
            </Alert>
          ) : (
            <>
              {!userDetail.verified ? (
                <Alert variant="outlined" severity="error">
                  Neověřený uživatel
                </Alert>
              ) : (
                <Alert variant="outlined" severity="success">
                  Ověřený uživatel
                </Alert>
              )}
            </>
          )}
          {userDetail.parrentAccount && (
            <Alert
              variant="outlined"
              severity="info"
              icon={<SupervisedUserCircleIcon />}
            >
              Dětský účet pod správou: {userDetail.first_name}{" "}
              {userDetail.last_name}
            </Alert>
          )}
        </div>
      </div>
      <Divider orientation="vertical" flexItem />
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
            <TableListPagination
              name="groups"
              rpp={5}
              count={userDetail.groups.count}
            />
          </div>
        </div>
        <Divider orientation="vertical" flexItem />
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
        <Divider orientation="vertical" flexItem />
        <div className="flex flex-col">
          <Typography variant="h5">Dětské účty uživatele</Typography>
          <Divider />
          <List>
            {userDetail.children.count ? (
              userDetail.children.data.map((child: any) => (
                <ListItem disablePadding key={child.id}>
                  <ListItemText
                    primary={
                      <Typography>
                        {child.first_name} {child.last_name}
                      </Typography>
                    }
                    secondary={child.email}
                  />
                </ListItem>
              ))
            ) : (
              <>
                <Typography>Žádné dětské uživatele</Typography>
              </>
            )}
          </List>
          <div className="mt-auto">
            <TableListPagination
              name="children"
              rpp={5}
              count={userDetail.children.count}
            />
          </div>
        </div>
      </div>
    </Paper>
  );
}
