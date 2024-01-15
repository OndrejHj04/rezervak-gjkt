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
import { useState } from "react";
import AddGroupsModal from "./AddGroupsModal";
import AddReservationsModal from "./AddReservationsModal";
import UserSleepModal from "./UserSleepModal";
import UserSleepAnnouncment from "./UserSleepAnnouncment";
import GroupsPagination from "./GroupsPagination";
import ReservationsPagination from "./ReservationsPagination";
import { rolesConfig } from "@/rolesConfig";

export default function UserDetailForm({
  userDetail,
  roles,
  userRole,
}: {
  userDetail: any;
  roles: Role[];
  userRole: any;
}) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isDirty },
    setValue,
    watch,
  } = useForm();
  const { push } = useRouter();

  const [selectGroups, setSelectGroups] = useState<number[]>([]);
  const [selectReservations, setSelectReservation] = useState<number[]>([]);
  const [groupsModal, setGroupsModal] = useState(false);
  const [reservationsModal, setReservationsModal] = useState(false);
  const makeEdit = rolesConfig.users.modules.userDetail.edit.includes(userRole);

  const makeUserSleep = (id: any, active: any) => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/sleep`, {
      method: "POST",
      body: JSON.stringify({ id, active }),
    })
      .then((res) => res.json())
      .then(() => {
        MakeUserDetailRefetch(userDetail.id);
        toast.success("Uživatel byl upraven");
      });
  };

  const onSubmit = (data: any) => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/edit/${userDetail.id}`,
      {
        method: "POST",
        body: JSON.stringify({
          ...data,
          birth_date: dayjs(data.birth_date).format("YYYY-MM-DD"),
          role: data.role.id,
        }),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          toast.success("Uživatel byl upraven.");
          MakeUserDetailRefetch(userDetail.id);
        } else toast.error("Něco se pokazilo.");
        setValue("birth_date", data.birth_date);
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
        groups: selectGroups,
      }),
    })
      .then((req) => req.json())
      .then((res) => {
        if (res.success) toast.success("Skupiny úspěšně odebrány");
        else toast.error("Něco se nepovedlo");

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
        reservations: selectReservations,
      }),
    })
      .then((req) => req.json())
      .then((res) => {
        if (res.success) toast.success("Rezervace úspěšně odebrány");
        else toast.error("Něco se nepovedlo");

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
              currentGroups={userDetail.groups.data.map(
                (group: any) => group.id
              )}
              userId={userDetail.id}
              userEmail={userDetail.email}
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
              currentReservations={userDetail.reservations.data.map(
                (group: any) => group.id
              )}
              userId={userDetail.id}
              userEmail={userDetail.email}
              setModal={setReservationsModal}
            />
          )}
        </Modal>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
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
                    defaultValue={
                      userDetail.birth_date && dayjs(userDetail.birth_date)
                    }
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
                      isOptionEqualToValue={(option, value) =>
                        option.id === value.id
                      }
                      options={roles}
                      onChange={(e, value) => {
                        onChange(value);
                      }}
                      renderOption={(props: any, option: any) => (
                        <div {...props}>{option.name}</div>
                      )}
                      getOptionLabel={(option: any) => option.name}
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
            <div className="flex flex-col gap-2 ml-auto">
              {makeEdit && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() =>
                    makeUserSleep(userDetail.id, userDetail.active)
                  }
                >
                  {userDetail.active ? "Uspat uživatele" : "Probudit uživatele"}
                </Button>
              )}
              <Button variant="outlined" type="submit" disabled={!isDirty}>
                Uložit
              </Button>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex flex-col">
              <Typography variant="h5">Skupiny uživatele</Typography>
              <Divider />
              <List sx={{ height: 360 }}>
                {userDetail.groups.count ? (
                  userDetail.groups.data.map((group: any) => (
                    <ListItem disablePadding key={group.id}>
                      <ListItemButton
                        sx={{ padding: 1 }}
                        onClick={() => handleCheckGroup(group.id)}
                      >
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
                    <Typography>Žádné skupiny uživatele</Typography>
                  </>
                )}
              </List>
              <GroupsPagination count={userDetail.groups.count} />
              {makeEdit && (
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
              )}
            </div>
            <div className="flex flex-col">
              <Typography variant="h5">Rezervace uživatele</Typography>
              <Divider />
              <List sx={{ height: 360 }}>
                {userDetail.reservations.count ? (
                  userDetail.reservations.data.map((reservation: any) => (
                    <ListItem disablePadding key={reservation.id}>
                      <ListItemButton
                        sx={{ padding: 1 }}
                        onClick={() => handleCheckReservation(reservation.id)}
                      >
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
                            push(`/reservation/detail/${reservation.id}`);
                          }}
                        >
                          <Icon>info_icon</Icon>
                        </IconButton>
                      </ListItemButton>
                    </ListItem>
                  ))
                ) : (
                  <>
                    <Typography>Žádné rezervace uživatele</Typography>
                  </>
                )}
              </List>
              <ReservationsPagination count={userDetail.reservations.count} />
              {makeEdit && (
                <div className="flex flex-col gap-2">
                  <Button
                    variant="contained"
                    color="error"
                    endIcon={<DeleteForeverIcon />}
                    disabled={!selectReservations.length}
                    onClick={removeReservations}
                  >
                    Odebrat uživatele z vybraných rezervací
                  </Button>
                  <Button
                    variant="contained"
                    endIcon={<AddToPhotosIcon />}
                    onClick={() => setReservationsModal(true)}
                  >
                    Přidat uživatele do rezervace
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Paper>
      </form>
    </>
  );
}
