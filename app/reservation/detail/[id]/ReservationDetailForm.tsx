"use client";
import AvatarWrapper from "@/ui-components/AvatarWrapper";
import {
  Button,
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
  Modal,
  Paper,
  Radio,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";
import { toast } from "react-toastify";
import AddUserModal from "./AddUserModal";
import AddGroupsModal from "./AddGroupsModal";
import MakeReservationDetailRefetch from "./refetch";
import PerfectScrollbar from "react-perfect-scrollbar";
import TableListPagination from "@/ui-components/TableListPagination";
import {
  editReservationDetail,
  reservationRemoveGroups,
  reservationRemoveUsers,
  reservationSaveRooms,
  reservationsDelete,
  reservationUpdateStatus,
} from "@/lib/api";
import { roomsEnum } from "@/app/constants/rooms";

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
    formState: { isDirty, dirtyFields },
    control
  } = useForm({
    defaultValues: {
      from_date: dayjs(reservation.from_date),
      to_date: dayjs(reservation.to_date),
      name: reservation.name,
      purpouse: reservation.purpouse,
      instructions: reservation.instructions
    }
  });


  const onSubmit = (data: any) => {
    editReservationDetail({
      id: reservation.id, dirtyFields,
      from_date: dayjs(data.from_date).format("YYYY-MM-DD"),
      to_date: dayjs(data.to_date).format("YYYY-MM-DD"),
      instructions: data.instructions,
      name: data.name,
      purpouse: data.purpouse
    }).then(
      ({ success }) => {
        success && toast.success("Rezervace byla upravena");
        !success && toast.error("Něco se nepovedlo");
        reset(data);
      }
    );
    MakeReservationDetailRefetch(reservation.id);
  };

  const { push } = useRouter();
  const [selectedUsers, setSelecetedUsers] = useState<number[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<number[]>([]);
  const [usersModal, setUsersModal] = useState(false);
  const [groupsModal, setGroupsModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<number>(
    reservation.status.id
  );
  const [rejectedReason, setRejectedReason] = useState("")
  const [successLink, setSuccessLink] = useState("")
  const [selectedRooms, setSelectedRooms] = useState(reservation.rooms)

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

  const handleCheckRoom = (id: number) => {
    if (selectedRooms.includes(id)) {
      setSelectedRooms(selectedRooms.filter((room: any) => room !== id).sort());
    } else {
      setSelectedRooms([...selectedRooms, id].sort());
    }
  };

  const saveReservationRooms = () => {
    reservationSaveRooms({
      reservation: reservation.id,
      rooms: selectedRooms
    }).then(({ success }) => {
      success && toast.success("Nastavení pokojů úspěšně uloženo");
      !success && toast.error("Něco se nepovedlo");
    })
    MakeReservationDetailRefetch(reservation.id);
  }

  const handleRemoveUsers = () => {
    reservationRemoveUsers({
      reservation: reservation.id,
      users: selectedUsers,
    }).then(({ success }) => {
      success && toast.success("Uživatelé byli odebráni z rezervace");
      !success && toast.error("Něco se nepovedlo");
    });
    MakeReservationDetailRefetch(reservation.id);
    setSelecetedUsers([]);
  };

  const handleRemoveGroups = () => {
    reservationRemoveGroups({
      reservation: reservation.id,
      groups: selectedGroups,
    }).then(({ success }) => {
      success && toast.success("Skupiny byly odebrány z rezervace");
      !success && toast.error("Něco se nepovedlo");
    });
    MakeReservationDetailRefetch(reservation.id);
    setSelectedGroups([]);
  };

  const handleDeleteReservation = () => {
    reservationsDelete({ reservations: [reservation.id] }).then(
      ({ success }) => {
        success && toast.success("Rezervaci odstraněna");
        !success && toast.error("Něco se nepovedlo");
      }
    );
    push("/reservation/list");
  };

  const handleUpdateStatus = () => {
    reservationUpdateStatus({
      id: reservation.id,
      newStatus: selectedStatus,
      oldStatus: reservation.status.id,
      ...(rejectedReason.length && { rejectReason: rejectedReason }),
      ...(successLink.length && { successLink: successLink })
    }).then(({ success }) => {
      success && toast.success("Status rezervace byl změněn");
      !success && toast.error("Něco se nepovedlo");
    });
    selectedStatus !== 1
      ? MakeReservationDetailRefetch(reservation.id)
      : window.location.reload();
    reset();
    setRejectedReason("")
    setSuccessLink("")
  };

  useEffect(() => {
    setSelectedStatus(reservation.status.id)
  }, [reservation])

  useEffect(() => {
    setRejectedReason("")
  }, [selectedStatus])

  const maxMembers = reservation.rooms.reduce(
    (a: any, b: any) => a + b.people,
    0
  );
  return (
    <>
      {usersModal && (
        <Modal open={usersModal} onClose={() => setUsersModal(false)}>
          {usersModal && (
            <AddUserModal
              reservation={reservation}
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
        <Paper className="lg:p-4 p-2 flex flex-col gap-3">
          <div className="flex lg:flex-row flex-col gap-2">
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
              <div className="flex gap-2">
                <Typography variant="h6">Status:</Typography>
                <Chip
                  label={reservation.status.display_name}
                  icon={
                    <Icon sx={{ "&&": { color: reservation.status.color } }}>
                      {reservation.status.icon}
                    </Icon>
                  }
                />
              </div>
            </div>

            <div className="flex gap-2 sm:flex-row flex-col">
              <div className="flex flex-col justify-between gap-2">
                <TextField
                  label="Název"
                  {...register("name")}
                />
                <TextField
                  {...register("purpouse")}
                  label="Účel rezervace"
                />
              </div>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div className="flex flex-col justify-between gap-2">
                  <Controller control={control} name="from_date" render={({ field: { value, onChange } }) => (
                    <DatePicker value={value} onChange={(e) => onChange(e)} label="Začátek rezervace" format="DD. MM. YYYY" disabled={reservation.status.id === 3} />
                  )} />
                  <Controller control={control} name="to_date" render={({ field: { value, onChange } }) => (
                    <DatePicker value={value} onChange={(e) => onChange(e)} label="Konec rezervace" format="DD. MM. YYYY" disabled={reservation.status.id === 3} />
                  )} />
                </div>
              </LocalizationProvider>
              <TextField
                multiline
                minRows={4}
                maxRows={4}
                label="Pokyny pro účastníky"
                sx={{
                  "& .MuiInputBase-root": {
                    height: "100%",
                  },
                }}
                {...register("instructions")}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Button
                variant="outlined"
                color="error"
                onClick={handleDeleteReservation}
              >
                Odstranit
              </Button>
              <Button variant="outlined" type="submit" disabled={!isDirty}>
                Uložit změny
              </Button>
            </div>
          </div>
          <div className="flex gap-2 lg:flex-row flex-col">
            <Typography variant="h6">
              Datum vytvoření:{" "}
              {dayjs(reservation.creation_date).format("DD. MM. YYYY")}
            </Typography>
          </div>
          <div className="flex gap-2 lg:flex-row flex-col">
            <div className="flex flex-col">
              <Typography variant="h5">Uživatelé v rezervaci</Typography>
              <Divider />
              <List>
                <PerfectScrollbar>
                  {reservation.users.count ? (
                    reservation.users.data.map((user: any) => (
                      <ListItem disablePadding key={user.id}>
                        <ListItemButton
                          sx={{ padding: 1 }}
                          disabled={reservation.leader.id === user.id}
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
                          {reservation.leader.id !== user.id && (
                            <Checkbox
                              disableRipple
                              checked={selectedUsers.includes(user.id)}
                            />
                          )}
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
              <div className="mt-auto">
                <TableListPagination
                  count={reservation.users.count}
                  name="users"
                  rpp={5}
                />
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
            </div>
            <div className="flex flex-col">
              <Typography variant="h5">Skupiny v rezervaci</Typography>
              <Divider />
              <List>
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
                            secondary={"Počet členů: " + group.users.length}
                          />
                          <Checkbox
                            disableRipple
                            checked={selectedGroups.includes(group.id)}
                          />
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
              <div className="mt-auto">
                <TableListPagination
                  name="group"
                  rpp={5}
                  count={reservation.groups.count}
                />
                <div className="flex flex-col gap-2">
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
            <div className="flex flex-col">
              <Typography variant="h5">Pokoje</Typography>
              <Divider />
              <List>
                {roomsEnum.list.map((room) => (
                  <ListItem key={room.id} disablePadding>
                    <ListItemButton className="!p-1" onClick={() => handleCheckRoom(room.id)}>
                      <ListItemText
                        primary={room.label}
                        secondary={`Počet lůžek: ${room.capacity}`}
                      />
                      <Checkbox
                        disableRipple
                        checked={selectedRooms.includes(room.id)}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
              <div className="mt-auto">
                <div className="flex flex-col gap-2">
                  <Button
                    variant="contained"
                    endIcon={<AddToPhotosIcon />}
                    disabled={selectedRooms.toString() === reservation.rooms.toString()}
                    onClick={saveReservationRooms}
                  >
                    Uložit
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <Typography variant="h5">Status rezervace</Typography>
              <Divider />
              <List>
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
              {selectedStatus === 4 && <TextField className="mb-2" fullWidth label="Důvod zamítnutí" size="small" value={rejectedReason} onChange={(e) => setRejectedReason(e.target.value)} />
              }
              {selectedStatus === 3 &&
                <TextField className="mb-2" fullWidth label="Odkaz na web Pece pod Sněžkou" size="small" value={successLink} onChange={(e) => setSuccessLink(e.target.value)} />}

              <div className="flex flex-col gap-2 mt-auto">
                <Button
                  variant="contained"
                  endIcon={<AddToPhotosIcon />}
                  disabled={selectedStatus === reservation.status.id || (selectedStatus === 4 && !rejectedReason.length) || (selectedStatus === 3 && !successLink.length)}
                  onClick={handleUpdateStatus}
                >
                  Uložit stav
                </Button>
                {selectedStatus === 1 && (
                  <Typography
                    color="error"
                    className="text-center"
                    variant="body1"
                  >
                    Tato akce je nevratná!
                  </Typography>
                )}
              </div>
            </div>
          </div>
        </Paper>
      </form>
    </>
  );
}
