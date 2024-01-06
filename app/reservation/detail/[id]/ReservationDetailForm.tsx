"use client";
import { Reservation, ReservationStatus } from "@/types";
import AvatarWrapper from "@/ui-components/AvatarWrapper";
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  Icon,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Modal,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
import MakeReservationDetailRefetch from "./refetch";
import ReservationListMakeRefetch from "../../list/refetch";
import PerfectScrollbar from "react-perfect-scrollbar";
import GroupsPagination from "./GroupsPagination";
import UsersPagination from "./UsersPagination";

export default function ReservationDetailForm({
  reservation,
  reservationStatus,
}: {
  reservation: any;
  reservationStatus: any;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
    getValues,
  } = useForm();

  const onSubmit = (data: any) => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/reservations/edit-reservation/${reservation.id}`,
      {
        method: "POST",
        body: JSON.stringify({
          name: data.name,
          purpouse: data.purpouse,
          rooms: Number(data.rooms),
          instructions: data.instructions,
        }),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.success) toast.success("Rezervace byla upravena");
        else toast.error("Něco se nepovedlo");
        MakeReservationDetailRefetch(reservation.id);
        reset();
      });
  };

  const { push } = useRouter();
  const [selectedUsers, setSelecetedUsers] = useState<number[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<number[]>([]);
  const [usersModal, setUsersModal] = useState(false);
  const [groupsModal, setGroupsModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<number>(
    reservation.status.id
  );

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
        currentUsers: reservation.users.data.map((user: any) => user.id),
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) toast.success("Uživatelé byli odebráni z rezervace");
        else toast.error("Něco se nepovedlo");

        MakeReservationDetailRefetch(reservation.id);
        setSelecetedUsers([]);
      });
  };

  const handleRemoveGroups = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reservations/remove-groups`, {
      method: "POST",
      body: JSON.stringify({
        reservation: reservation.id,
        removeGroups: selectedGroups,
        currentGroups: reservation.groups.data.map((group: any) => group.id),
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) toast.success("Skupiny byly odebrány z rezervace");
        else toast.error("Něco se nepovedlo");
        MakeReservationDetailRefetch(reservation.id);
        setSelectedGroups([]);
      });
  };

  const handleDeleteReservation = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reservations/delete`, {
      method: "POST",
      body: JSON.stringify({ reservations: [reservation.id] }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          toast.success("Rezervace byla odstraněna");
        } else toast.error("Něco se nepovedlo");
      });
    ReservationListMakeRefetch("/reservation/list");
  };

  const handleUpdateStatus = () => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/reservations/update-status/${reservation.id}`,
      {
        method: "POST",
        body: JSON.stringify({
          status: selectedStatus,
        }),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.success) toast.success("Status rezervace byl změněn");
        else toast.error("Něco se nepovedlo");
        MakeReservationDetailRefetch(reservation.id);
        reset();
      });
  };

  return (
    <>
      {usersModal && (
        <Modal open={usersModal} onClose={() => setUsersModal(false)}>
          {usersModal && (
            <AddUserModal
              reservationId={reservation.id}
              currentUsers={reservation.users.data.map((user: any) => user.id)}
              setModal={setUsersModal}
            />
          )}
        </Modal>
      )}
      {groupsModal && (
        <Modal open={groupsModal} onClose={() => setGroupsModal(false)}>
          <AddGroupsModal
            reservationId={reservation.id}
            currentGroups={reservation.groups.data.map(
              (group: any) => group.id
            )}
            setModal={setGroupsModal}
          />
        </Modal>
      )}

      <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
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
              <div className="flex ">
                <Typography variant="h6">Status:</Typography>
                <Chip
                  label={reservation.status.display_name}
                  sx={{
                    margin: "auto",
                  }}
                  icon={
                    <Icon sx={{ "&&": { color: reservation.status.color } }}>
                      {reservation.status.icon}
                    </Icon>
                  }
                />
              </div>
            </div>
            <div>
              <TextField
                label="Název"
                {...register("name")}
                defaultValue={reservation.name}
              />
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
            <div className="flex flex-col gap-3 mr-3">
              <TextField
                {...register("purpouse")}
                label="Účel rezervace"
                defaultValue={reservation.purpouse}
              />
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Počet pokojů
                </InputLabel>
                <Select
                  id="demo-simple-select"
                  labelId="demo-simple-select-label"
                  defaultValue={reservation.rooms}
                  label="Počet pokojů"
                  {...register("rooms")}
                >
                  {[...Array(5)].map((_, i) => (
                    <MenuItem key={i} value={i + 1}>
                      {i + 1} Pokojů
                    </MenuItem>
                  ))}
                  <MenuItem value={6}>Celá chata</MenuItem>
                </Select>
              </FormControl>
            </div>
            <TextField
              multiline
              label="Pokyny pro účastníky"
              minRows={4}
              defaultValue={reservation.instructions}
              maxRows={4}
              {...register("instructions")}
            />
            <div className="flex flex-col ml-3 gap-2">
              <Button
                variant="outlined"
                color="error"
                onClick={handleDeleteReservation}
              >
                Odstranit
              </Button>
              <Button variant="outlined" type="submit" disabled={!isDirty}>
                Uložit
              </Button>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex flex-col">
              <Typography variant="h5">Uživatelé v rezervaci</Typography>
              <Divider />
              <List sx={{ height: 360 }}>
                <PerfectScrollbar>
                  {reservation.users.count ? (
                    reservation.users.data.map((user: any) => (
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
                </PerfectScrollbar>
              </List>
              <UsersPagination count={reservation.users.count} />
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
              <List sx={{ height: 360 }}>
                <PerfectScrollbar>
                  {reservation.groups.count ? (
                    reservation.groups.data.map((group: any) => (
                      <ListItem disablePadding key={group.id}>
                        <ListItemButton
                          sx={{ padding: 1 }}
                          onClick={() => handleCheckGroup(group.id)}
                        >
                          <ListItemText
                            primary={group.name}
                            secondary={
                              "Počet členů: " + JSON.parse(group.users).length
                            }
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
                </PerfectScrollbar>
              </List>
              <GroupsPagination count={reservation.groups.count} />
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
            <div className="flex flex-col">
              <Typography variant="h5">Status rezervace</Typography>
              <Divider />
              <List sx={{ height: 412 }}>
                {reservationStatus.map((status: any) => (
                  <ListItem disablePadding key={status.id} value={status.id}>
                    <ListItemButton
                      sx={{ padding: 1 }}
                      onClick={() => setSelectedStatus(status.id)}
                    >
                      <Radio
                        checked={selectedStatus === status.id}
                        disableRipple
                      />
                      <Chip
                        label={status.display_name}
                        sx={{
                          margin: "auto",
                        }}
                        icon={
                          <Icon sx={{ "&&": { color: status.color } }}>
                            {status.icon}
                          </Icon>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
              <div className="flex flex-col gap-2 ">
                <Button
                  variant="contained"
                  endIcon={<AddToPhotosIcon />}
                  disabled={selectedStatus === reservation.status.id}
                  onClick={handleUpdateStatus}
                >
                  Uložit stav
                </Button>
              </div>
            </div>
          </div>
        </Paper>
      </form>
    </>
  );
}
