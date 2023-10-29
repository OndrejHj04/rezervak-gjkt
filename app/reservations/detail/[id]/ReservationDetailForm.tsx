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
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import ReservationCalendar from "./ReservationCalendar";
import { use, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import InfoIcon from "@mui/icons-material/Info";
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";
import { toast } from "react-toastify";
import AddUserModal from "./AddUserModal";
import AddGroupsModal from "./AddGroupsModal";
import MakeRefetch from "./refetch";

export default function ReservationDetailForm({
  reservation,
}: {
  reservation: Reservation;
}) {
  const {
    register,
    handleSubmit,
    formState: { isDirty },
  } = useForm();

  const onSubmit = (data: any) => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/reservations/edit-reservation/${reservation.id}`,
      {
        method: "POST",
        body: JSON.stringify({
          purpouse: data.purpouse,
          rooms: Number(data.rooms),
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => toast.success("Rezervace byla upravena"))
      .catch((e) => toast.error("Něco se nepovedlo"))
      .finally(() => {
        MakeRefetch(reservation.id);
      });
  };

  const { push } = useRouter();
  const [selectedUsers, setSelecetedUsers] = useState<number[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<number[]>([]);
  const [usersModal, setUsersModal] = useState(false);
  const [groupsModal, setGroupsModal] = useState(false);

  const handleCheckUser = (id: number) => {
    if (selectedUsers.includes(id)) {
      setSelecetedUsers(selectedUsers.filter((user) => user !== id));
    } else {
      setSelecetedUsers([...selectedUsers, id]);
    }
  };

  const handleCheckGroup = (id: number) => {
    if (selectedGroups.includes(id)) {
      setSelectedGroups(selectedGroups.filter((group) => group !== id));
    } else {
      setSelectedGroups([...selectedGroups, id]);
    }
  };

  const handleRemoveUsers = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reservations/remove-users`, {
      method: "POST",
      body: JSON.stringify({
        reservation: reservation.id,
        removeUsers: selectedUsers,
        currentUsers: reservation.users.map((user: any) => user.id),
      }),
    })
      .then((res) => res.json())
      .then((data) => toast.success("Uživatelé byli odebráni z rezervace"))
      .catch((e) => toast.error("Něco se nepovedlo"))
      .finally(() => {
        MakeRefetch(reservation.id);
        setSelecetedUsers([]);
      });
  };
  const handleRemoveGroups = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reservations/remove-groups`, {
      method: "POST",
      body: JSON.stringify({
        reservation: reservation.id,
        removeGroups: selectedGroups,
        currentGroups: reservation.groups.map((group: any) => group.id),
      }),
    })
      .then((res) => res.json())
      .then((data) => toast.success("Skupiny byly odebrány z rezervace"))
      .catch((e) => toast.error("Něco se nepovedlo"))
      .finally(() => {
        MakeRefetch(reservation.id);
        setSelectedGroups([]);
      });
  };

  return (
    <>
      {usersModal && (
        <Modal open={usersModal} onClose={() => setUsersModal(false)}>
          {usersModal && (
            <AddUserModal
              reservationId={reservation.id}
              currentUsers={reservation.users.map((user) => user.id)}
              setModal={setUsersModal}
            />
          )}
        </Modal>
      )}
      {groupsModal && (
        <Modal open={groupsModal} onClose={() => setGroupsModal(false)}>
          <AddGroupsModal
            reservationId={reservation.id}
            currentGroups={reservation.groups.map((group: any) => group.id)}
            setModal={setGroupsModal}
          />
        </Modal>
      )}

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
                <DatePicker
                  value={dayjs(reservation.from_date)}
                  disabled
                  label="Začátek rezervace"
                  format="DD.MM.YYYY"
                />

                <DatePicker
                  value={dayjs(reservation.to_date)}
                  disabled
                  label="Konec rezervace"
                  format="DD.MM.YYYY"
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
                        onClick={() => handleCheckUser(user.id)}
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
                        <Checkbox
                          disableRipple
                          checked={selectedUsers.includes(user.id)}
                        />
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            push(`/user/detail/${user.id}`);
                          }}
                        >
                          <InfoIcon />
                        </IconButton>
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
                  disabled={!selectedUsers.length}
                  onClick={handleRemoveUsers}
                >
                  Odebrat vybrané uživatele
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setUsersModal(true)}
                  endIcon={<AddToPhotosIcon />}
                >
                  Přidat uživatele
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
                        onClick={() => handleCheckGroup(group.id)}
                      >
                        <ListItemIcon>
                          <Avatar />
                        </ListItemIcon>
                        <ListItemText
                          primary={group.name}
                          secondary={"Počet členů: " + group.users.length}
                        />
                        <Checkbox
                          disableRipple
                          checked={selectedGroups.includes(group.id)}
                        />
                        <IconButton
                          onClick={() => push(`/group/detail/${group.id}`)}
                        >
                          <InfoIcon />
                        </IconButton>
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
                  disabled={!selectedGroups.length}
                  onClick={handleRemoveGroups}
                >
                  Odebrat vybrané skupiny
                </Button>
                <Button
                  variant="contained"
                  endIcon={<AddToPhotosIcon />}
                  onClick={() => setGroupsModal(true)}
                >
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
