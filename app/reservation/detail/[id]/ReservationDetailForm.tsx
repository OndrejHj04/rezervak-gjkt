"use client";
import AvatarWrapper from "@/ui-components/AvatarWrapper";
import {
  Button,
  ButtonBase,
  CardHeader,
  CircularProgress,
  Divider,
  Icon,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import AddUserModal from "./AddUserModal";
import AddGroupsModal from "./AddGroupsModal";
import TableListPagination from "@/ui-components/TableListPagination";
import {
  editReservationDetail,
  reservationRemoveGroups,
  reservationRemoveUsers,
  reservationSaveRooms,
  reservationsDelete,
  reservationUpdateStatus,
  cancelRegistration,
} from "@/lib/api";
import { roomsEnum } from "@/app/constants/rooms";
import Link from "next/link";
import { LoadingButton } from "@mui/lab";

export default function ReservationDetailForm({
  reservation,
  reservationStatus,
}: {
  reservation: any;
  reservationStatus: any;
}) {
  const { refresh } = useRouter()
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
      instructions: reservation.instructions,
      success_link: reservation.success_link,
      payment_symbol: reservation.payment_symbol,
    }
  });


  const onSubmit = (data: any) => {
    editReservationDetail({
      id: reservation.id, dirtyFields,
      from_date: dayjs(data.from_date).format("YYYY-MM-DD"),
      to_date: dayjs(data.to_date).format("YYYY-MM-DD"),
      instructions: data.instructions,
      name: data.name,
      purpouse: data.purpouse,
      success_link: data.success_link,
      payment_symbol: data.payment_symbol
    }).then(
      ({ success }) => {
        success && toast.success("Rezervace byla upravena");
        !success && toast.error("Něco se nepovedlo");
        reset(data);
      }
    );
    refresh()
  };

  const { push } = useRouter();
  const [selectedUsers, setSelecetedUsers] = useState<number[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<number[]>([]);
  const [usersModal, setUsersModal] = useState(false);
  const [groupsModal, setGroupsModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<number>(
    reservation.status.id
  );
  const [rejectedReason, setRejectedReason] = useState(reservation.reject_reason)
  const [selectedRooms, setSelectedRooms] = useState(reservation.rooms)
  const [stopSinginLoading, setStopSigninLoading] = useState(false)

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
    refresh()
  }

  const handleRemoveUsers = () => {
    reservationRemoveUsers({
      reservation: reservation.id,
      users: selectedUsers,
    }).then(({ success }) => {
      success && toast.success("Uživatelé byli odebráni z rezervace");
      !success && toast.error("Něco se nepovedlo");
    });
    refresh()
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
    refresh()
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
      paymentSymbol: reservation.paymentSymbol,
      successLink: reservation.successLink,
      ...(rejectedReason && rejectedReason.length && { rejectReason: rejectedReason }),
    }).then(({ success, rejectReason }) => {
      success && toast.success("Status rezervace byl změněn");
      !success && toast.error("Něco se nepovedlo");
      setRejectedReason(rejectReason)
    });
    // selectedStatus !== 1 go to list page
    reset();
  };

  const handleStopSignin = () => {
    setStopSigninLoading(true)
    cancelRegistration({
      formId: reservation.form.id
    }).then(({ success }) => {
      if (success) toast.success("Přihlašování na rezervaci úspěšně zastaveno")
      else toast.error("Něco se nepovedlo")
      setStopSigninLoading(false)
      refresh()
    })
  }

  useEffect(() => {
    setSelectedStatus(reservation.status.id)
  }, [reservation])

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
        <Paper className="md:p-3 p-1 flex flex-col gap-3">
          <div className="flex md:flex-row flex-col md:gap-1 gap-3">
            <div className="flex flex-col">
              <Typography variant="h5">Vedoucí rezervace:</Typography>
              <ButtonBase className="mr-auto">
                <CardHeader className="!p-0 text-inherit no-underline text-left" titleTypographyProps={{ variant: "h5" }} component={Link} href={`/user/detail/${reservation.leader.id}`}
                  avatar={<AvatarWrapper size={48} data={reservation.leader as any} />}
                  title={`${reservation.leader.first_name} ${reservation.leader.last_name}`}
                  subheader={reservation.leader.email}
                />
              </ButtonBase>
            </div>

            <div className="grid md:grid-rows-2 grid-rows-3 md:grid-cols-4 grid-cols-2 gap-3">
              <TextField
                label="Název"
                {...register("name")}
              />
              <Controller control={control} name="from_date" render={({ field: { value, onChange } }) => (
                <DatePicker className="col-start-2 row-start-1" value={value} onChange={(e) => onChange(e)} label="Začátek rezervace" format="DD. MM. YYYY" disabled={reservation.status.id === 3} />
              )} />
              <TextField
                label="Odkaz na web Pece pod Sněžkou"
                {...register("success_link")}
              />
              <TextField
                className="row-span-2 [&_.MuiInputBase-root]:h-full [&_.MuiInputBase-root]:py-2"
                multiline
                minRows={4}
                maxRows={4}
                label="Pokyny pro účastníky"
                {...register("instructions")}
              />
              <TextField
                {...register("purpouse")}
                label="Účel rezervace"
              />
              <Controller control={control} name="to_date" render={({ field: { value, onChange } }) => (
                <DatePicker value={value} onChange={(e) => onChange(e)} label="Konec rezervace" format="DD. MM. YYYY" disabled={reservation.status.id === 3} />
              )} />
              <TextField
                label="Variabilní symbol"
                {...register("payment_symbol")}
              />
            </div>
            <div className="md:ml-auto flex flex-col md:gap-2 gap-3">
              <Button variant="outlined" type="submit" disabled={!isDirty}>
                Uložit změny
              </Button>
              <LoadingButton
                variant="outlined"
                color="error"
                disabled={!reservation.form.id}
                loading={stopSinginLoading}
                onClick={handleStopSignin}
              >
                Ukončit přihlašování
              </LoadingButton>
              <Button
                variant="outlined"
                color="error"
                onClick={handleDeleteReservation}
              >
                Odstranit
              </Button>
            </div>
          </div>
          <Divider flexItem orientation="vertical" />
          <div className="flex gap-2 md:flex-row flex-col">
            <div className="flex flex-col">
              <Typography variant="h5" className="text-center">Účastníci rezervace</Typography>
              <Divider />
              <List>
                {reservation.users.data.map((user: any) => (
                  <ListItem disablePadding key={user.id}>
                    <ListItemButton
                      onClick={() => handleCheckUser(user.id)}
                      selected={selectedUsers.includes(user.id)}
                      disabled={reservation.leader.id === user.id}
                      className="[&]:!opacity-100 !py-0.5 px-2"
                    >
                      <ListItemIcon>
                        <AvatarWrapper data={user} />
                      </ListItemIcon>
                      <ListItemText
                        primary={`${user.first_name} ${user.last_name}`}
                        secondary={user.email}
                      />
                    </ListItemButton>
                  </ListItem>
                ))
                }
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
                    size="small"
                    disabled={!selectedUsers.length}
                    onClick={handleRemoveUsers}
                  >
                    Odebrat vybrané uživatele
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => setUsersModal(true)}
                  >
                    Přidat uživatele
                  </Button>
                </div>
              </div>
            </div>
            <Divider flexItem orientation="vertical" />
            <div className="flex flex-col">
              <Typography variant="h5" className="text-center">Skupiny v rezervaci</Typography>
              <Divider />
              <List>
                {reservation.groups.data.map((group: any) => (
                  <ListItem disablePadding key={group.id}>
                    <ListItemButton
                      onClick={() => handleCheckGroup(group.id)}
                      selected={selectedGroups.includes(group.id)}
                      className="!py-0.5 px-2"
                    >
                      <ListItemText
                        primary={group.name}
                        secondary={"Počet členů: " + group.users.length}
                      />
                    </ListItemButton>
                  </ListItem>
                ))
                }
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
                    size="small"
                    color="error"
                    disabled={!selectedGroups.length}
                    onClick={handleRemoveGroups}
                  >
                    Odpojit vybrané skupiny
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => setGroupsModal(true)}
                  >
                    Připojit skupiny
                  </Button>
                </div>
              </div>
            </div>
            <Divider orientation="vertical" flexItem />
            <div className="flex flex-col md:w-[200px] w-full">
              <Typography variant="h5" className="text-center">Status rezervace</Typography>
              <Divider />
              <List className="">
                {reservationStatus.map((status: any) => (
                  <ListItem disablePadding key={status.id} value={status.id}>
                    <ListItemButton
                      onClick={() => setSelectedStatus(status.id)}
                      selected={selectedStatus === status.id}
                      className="!py-0.5 px-2"
                    >
                      <ListItemIcon>
                        <Icon sx={{ "&&": { color: status.color } }}>
                          {status.icon}
                        </Icon>
                      </ListItemIcon>
                      <ListItemText primary={status.display_name} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
              <div className="mt-auto flex flex-col">
                {selectedStatus === 4 && <TextField className="mb-2" label="Důvod zamítnutí" size="small" value={rejectedReason} onChange={(e) => setRejectedReason(e.target.value)} />}
                <Button
                  size="small"
                  variant="contained"
                  disabled={selectedStatus === reservation.status.id && !(selectedStatus === 4 && rejectedReason !== reservation.reject_reason)}
                  onClick={handleUpdateStatus}
                >
                  Uložit stav
                </Button>
              </div>
            </div>
            <Divider orientation="vertical" flexItem />
            <div className="flex flex-col">
              <Typography variant="h5" className="text-center">Pokoje</Typography>
              <Divider />
              <List>
                {roomsEnum.list.map((room) => (
                  <ListItem key={room.id} disablePadding>
                    <ListItemButton selected={selectedRooms.includes(room.id)} onClick={() => handleCheckRoom(room.id)} className="!py-0.5 px-2">
                      <ListItemText
                        primary={room.label}
                        secondary={`Počet lůžek: ${room.capacity}`}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
              <div className="mt-auto">
                <div className="flex flex-col gap-2">
                  <Button
                    size="small"
                    variant="contained"
                    disabled={selectedRooms.toString() === reservation.rooms.toString()}
                    onClick={saveReservationRooms}
                  >
                    Uložit
                  </Button>
                </div>
              </div>
            </div>

          </div>
        </Paper >
      </form >
    </>
  );
}
