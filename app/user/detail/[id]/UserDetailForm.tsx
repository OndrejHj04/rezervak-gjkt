"use client";

import { Role } from "@/types";
import AvatarWrapper from "@/ui-components/AvatarWrapper";
import {
  Autocomplete,
  Avatar,
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
  TextField,
  Typography,
} from "@mui/material";
import { DateField, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { User } from "next-auth";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import MakeUserDetailRefetch from "./refetch";
import { useRouter } from "next/navigation";
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { use, useState } from "react";
import { group } from "console";
import AddGroupsModal from "./AddGroupsModal";
import AddReservationsModal from "./AddReservationsModal";

export default function UserDetailForm({
  userDetail,
  roles,
}: {
  userDetail: User;
  roles: Role[];
}) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isDirty },
  } = useForm();
  const { push } = useRouter();

  const [selectGroups, setSelectGroups] = useState<number[]>([]);
  const [selectReservations, setSelectReservation] = useState<number[]>([]);
  const [groupsModal, setGroupsModal] = useState(false);
  const [reservationsModal, setReservationsModal] = useState(false);

  const onSubmit = (data: any) => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/edit/${userDetail.id}`,
      {
        method: "POST",
        body: JSON.stringify({
          ...data,
          role: data.role.id,
        }),
      }
    )
      .then((res) => res.json())
      .then((res) => toast.success("Uživatel byl upraven."))
      .catch((err) => toast.error("Něco se pokazilo."))
      .finally(() => {
        MakeUserDetailRefetch(userDetail.id);
        reset();
      });
  };

  const handleCheckGroup = (id: number) => {
    if (selectGroups.includes(id)) {
      setSelectGroups(selectGroups.filter((group) => group !== id));
    } else {
      setSelectGroups([...selectGroups, id]);
    }
  };

  const removeGroups = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/remove-groups`, {
      method: "POST",
      body: JSON.stringify({
        user: userDetail.id,
        currentGroups: userDetail.groups.map((group) => group.id),
        removeGroups: selectGroups,
      }),
    })
      .then((req) => req.json())
      .then((data) => toast.success("Skupiny úspěšně odebrány"))
      .catch((err) => toast.error("Něco se nepovedlo"))
      .finally(() => {
        setSelectGroups([]);
        MakeUserDetailRefetch(userDetail.id);
      });
  };

  const handleCheckReservation = (id: number) => {
    if (selectReservations.includes(id)) {
      setSelectReservation(
        selectReservations.filter((reservation) => reservation !== id)
      );
    } else {
      setSelectReservation([...selectReservations, id]);
    }
  };

  const removeReservations = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/remove-reservations`, {
      method: "POST",
      body: JSON.stringify({
        user: userDetail.id,
        currentReservations: userDetail.reservations.map(
          (reservation) => reservation.id
        ),
        removeReservations: selectReservations,
      }),
    })
      .then((req) => req.json())
      .then((data) => toast.success("Rezervace úspěšně odebrány"))
      .catch((err) => toast.error("Něco se nepovedlo"))
      .finally(() => {
        setSelectReservation([]);
        MakeUserDetailRefetch(userDetail.id);
      });
  };

  return (
    <>
      {groupsModal && (
        <Modal open={groupsModal} onClose={() => setGroupsModal(false)}>
          {groupsModal && (
            <AddGroupsModal
              currentGroups={userDetail.groups.map((group) => group.id)}
              userId={userDetail.id}
              setModal={setGroupsModal}
            />
          )}
        </Modal>
      )}
      {reservationsModal && (
        <Modal
          open={reservationsModal}
          onClose={() => setReservationsModal(false)}
        >
          {reservationsModal && (
            <AddReservationsModal
              currentReservations={userDetail.reservations.map(
                (group) => group.id
              )}
              userId={userDetail.id}
              setModal={setReservationsModal}
            />
          )}
        </Modal>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <div className="flex gap-2 ml-auto">
          <Button variant="outlined" color="error">
            Uspat uživatele
          </Button>
          <Button variant="outlined" type="submit" disabled={!isDirty}>
            Uložit
          </Button>
        </div>
        <Paper className="p-4 flex flex-col gap-4">
          <div className="flex gap-2">
            <div className="flex flex-col">
              <div className="flex gap-2">
                <AvatarWrapper size={56} data={userDetail} />
                <div className="flex flex-col">
                  <Typography variant="h6" className="font-semibold">
                    {userDetail.first_name} {userDetail.last_name}
                  </Typography>
                  <Typography>{userDetail.email}</Typography>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Controller
                    control={control}
                    name="birth_date"
                    defaultValue={dayjs(userDetail.birth_date) as any}
                    render={({ field }) => (
                      <DateField
                        {...field}
                        label="Datum narození"
                        format="DD.MM.YYYY"
                      />
                    )}
                  />
                </LocalizationProvider>

                <TextField
                  label="Číslo OP"
                  {...register("ID_code")}
                  defaultValue={userDetail.ID_code}
                />
                <Controller
                  control={control}
                  name="role"
                  defaultValue={userDetail.role}
                  render={({ field: { value, onChange } }) => (
                    <Autocomplete
                      value={value}
                      options={roles}
                      onChange={(e, value) => {
                        onChange(value);
                      }}
                      renderOption={(props: any, option: any) => (
                        <div {...props}>{option.role_name}</div>
                      )}
                      getOptionLabel={(option: any) => option.role_name}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Role"
                          sx={{ width: 223 }}
                        />
                      )}
                    />
                  )}
                />
              </div>
              <TextField
                label="Adresa"
                className="col-span-2"
                {...register("adress")}
                defaultValue={userDetail.adress}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex flex-col">
              <Typography variant="h5">
                Skupiny uživatele{" "}
                {!!userDetail.groups.length && (
                  <span>({userDetail.groups.length})</span>
                )}
              </Typography>
              <Divider />
              <List sx={{ height: 400 }}>
                {userDetail.groups.length ? (
                  userDetail.groups.map((group: any) => (
                    <ListItem disablePadding key={group.id}>
                      <ListItemButton
                        sx={{ padding: 1 }}
                        onClick={() => handleCheckGroup(group.id)}
                      >
                        <ListItemIcon>
                          <Avatar />
                        </ListItemIcon>
                        <ListItemText
                          primary={<Typography>{group.name}</Typography>}
                          secondary={`Počet členů: ${group.users.length}`}
                        />
                        <Checkbox
                          disableRipple
                          checked={selectGroups.includes(group.id)}
                        />
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            push(`/group/detail/${group.id}`);
                          }}
                        >
                          <Icon>info_icon</Icon>
                        </IconButton>
                      </ListItemButton>
                    </ListItem>
                  ))
                ) : (
                  <>
                    <Typography>Žádní skupiny uživatele</Typography>
                  </>
                )}
              </List>
              <div className="flex flex-col gap-2">
                <Button
                  variant="contained"
                  color="error"
                  endIcon={<DeleteForeverIcon />}
                  disabled={!selectGroups.length}
                  onClick={removeGroups}
                >
                  Odebrat uživatele z vybraných skupin
                </Button>
                <Button
                  variant="contained"
                  endIcon={<AddToPhotosIcon />}
                  onClick={() => setGroupsModal(true)}
                >
                  Přidat uživatele do skupiny
                </Button>
              </div>
            </div>
            <div className="flex flex-col">
              <Typography variant="h5">
                Rezervace uživatele{" "}
                {!!userDetail.reservations.length && (
                  <span>({userDetail.reservations.length})</span>
                )}
              </Typography>
              <Divider />
              <List sx={{ height: 400 }}>
                {userDetail.reservations.length ? (
                  userDetail.reservations.map((reservation: any) => (
                    <ListItem disablePadding key={reservation.id}>
                      <ListItemButton
                        sx={{ padding: 1 }}
                        onClick={() => handleCheckReservation(reservation.id)}
                      >
                        <ListItemIcon>
                          <Avatar />
                        </ListItemIcon>
                        <ListItemText
                          primary={<Typography>{reservation.name}</Typography>}
                          secondary={`${dayjs(reservation.from_date).format(
                            "DD.MM.YYYY"
                          )} - ${dayjs(reservation.to_date).format(
                            "DD.MM.YYYY"
                          )}`}
                        />
                        <Checkbox
                          disableRipple
                          checked={selectReservations.includes(reservation.id)}
                        />
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            push(`/reservations/detail/${reservation.id}`);
                          }}
                        >
                          <Icon>info_icon</Icon>
                        </IconButton>
                      </ListItemButton>
                    </ListItem>
                  ))
                ) : (
                  <>
                    <Typography>Žádní uživatelé ve skupině</Typography>
                  </>
                )}
              </List>
              <div className="flex flex-col gap-2">
                <Button
                  variant="contained"
                  color="error"
                  endIcon={<DeleteForeverIcon />}
                  disabled={!selectReservations.length}
                  onClick={removeReservations}
                >
                  Odebrat vybrané uživatele ze skupiny
                </Button>
                <Button
                  variant="contained"
                  endIcon={<AddToPhotosIcon />}
                  onClick={() => setReservationsModal(true)}
                >
                  Přidat uživatele do skupiny
                </Button>
              </div>
            </div>
          </div>
        </Paper>
      </form>
    </>
  );
}
