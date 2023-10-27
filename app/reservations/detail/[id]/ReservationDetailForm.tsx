"use client";
import { Reservation } from "@/types";
import AvatarWrapper from "@/ui-components/AvatarWrapper";
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  Checkbox,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import ReservationCalendar from "./ReservationCalendar";
import { use, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

export default function ReservationDetailForm({
  reservation,
}: {
  reservation: Reservation;
}) {
  const {
    register,
    watch,
    handleSubmit,
    control,
    formState: { isDirty },
  } = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
  };

  const { push } = useRouter();
  const handleCheck = (user: any) => {};
  return (
    <>
      <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-2 ml-auto flex gap-2">
          <Button variant="outlined" type="submit" color="error">
            Odstranit
          </Button>
          <Button variant="outlined" type="submit" disabled={!isDirty}>
            Uložit
          </Button>
        </div>
        <Paper className="p-4 flex flex-col gap-4">
          <div className="flex">
            <div className="flex flex-col gap-1">
              <Typography variant="h5">Vedoucí rezervace</Typography>
              <div className="flex gap-2">
                <AvatarWrapper size={56} data={reservation.leader as any} />
                <div className="flex flex-col">
                  <Typography variant="h6" className="font-semibold">
                    {reservation.leader.first_name}{" "}
                    {reservation.leader.last_name}
                  </Typography>
                  <Typography>{reservation.leader.email}</Typography>
                </div>
              </div>
            </div>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div className="flex flex-col gap-3 mx-3">
                <Controller
                  control={control}
                  name="from_date"
                  defaultValue={dayjs(reservation.from_date)}
                  render={({ field: { onChange, value } }) => (
                    <DatePicker
                      value={value}
                      onChange={onChange}
                      label="Začátek rezervace"
                      format="DD.MM.YYYY"
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="to_date"
                  defaultValue={dayjs(reservation.to_date)}
                  render={({ field: { onChange, value } }) => (
                    <DatePicker
                      value={value}
                      onChange={onChange}
                      label="Konec rezervace"
                      format="DD.MM.YYYY"
                    />
                  )}
                />
              </div>
            </LocalizationProvider>
            <div className="flex flex-col gap-3">
              <TextField
                {...register("purpouse")}
                label="Účel rezervace"
                defaultValue={reservation.purpouse}
              />
              <Select defaultValue={reservation.rooms} {...register("rooms")}>
                {[...Array(5)].map((_, i) => (
                  <MenuItem key={i} value={i + 1}>
                    {i + 1} Pokojů
                  </MenuItem>
                ))}
                <MenuItem value={6}>Celá chata</MenuItem>
              </Select>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex flex-col">
              <Typography variant="h5">Uživatelé v rezervaci</Typography>
              <Divider />
              <List sx={{ height: 400, overflowY: "auto" }}>
                {reservation.users.length ? (
                  reservation.users.map((user: any) => (
                    <ListItem disablePadding key={user.id}>
                      <ListItemButton
                        sx={{ padding: 1 }}
                        onClick={() => push(`/user/detail/${user.id}`)}
                      >
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
                        <Checkbox disableRipple />
                      </ListItemButton>
                    </ListItem>
                  ))
                ) : (
                  <>
                    <Typography>Žádní uživatelé ve rezervaci</Typography>
                  </>
                )}
              </List>
              <div className="flex flex-col gap-2">
                <Button
                  variant="contained"
                  color="error"
                  endIcon={<DeleteForeverIcon />}
                >
                  Odebrat vybrané uživatele
                </Button>
                <Button variant="contained" endIcon={<DeleteForeverIcon />}>
                  Přidat skupiny
                </Button>
              </div>
            </div>
            <div className="flex flex-col">
              <Typography variant="h5">Skupiny v rezervaci</Typography>
              <Divider />
              <List sx={{ height: 400, overflowY: "auto" }}>
                {reservation.groups.length ? (
                  reservation.groups.map((group: any) => (
                    <ListItem disablePadding key={group.id}>
                      <ListItemButton
                        sx={{ padding: 1 }}
                        onClick={() => push(`/group/detail/${group.id}`)}
                      >
                        <ListItemIcon>
                          <Avatar />
                        </ListItemIcon>
                        <ListItemText
                          primary={group.name}
                          secondary={"Počet členů: " + group.users.length}
                        />
                        <Checkbox disableRipple />
                      </ListItemButton>
                    </ListItem>
                  ))
                ) : (
                  <>
                    <Typography>Žádné skuiny v rezervaci</Typography>
                  </>
                )}
              </List>
              <div className="flex flex-col gap-2 ">
                <Button
                  variant="contained"
                  color="error"
                  endIcon={<DeleteForeverIcon />}
                >
                  Odebrat vybrané skupiny
                </Button>
                <Button variant="contained" endIcon={<DeleteForeverIcon />}>
                  Přidat skupiny
                </Button>
              </div>
            </div>
          </div>
        </Paper>
      </form>
    </>
  );
}
