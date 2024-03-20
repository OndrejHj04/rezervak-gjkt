"use client";

import { Role } from "@/types";
import AvatarWrapper from "@/ui-components/AvatarWrapper";
import {
  Alert,
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
  TablePagination,
  TextField,
  Typography,
} from "@mui/material";
import { DateField, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import MakeUserDetailRefetch from "./refetch";
import { useRouter } from "next/navigation";
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useState } from "react";
import AddGroupsModal from "./AddGroupsModal";
import AddReservationsModal from "./AddReservationsModal";
import { rolesConfig } from "@/lib/rolesConfig";
import HotelIcon from "@mui/icons-material/Hotel";
import fetcher from "@/lib/fetcher";
import TableListPagination from "@/ui-components/TableListPagination";

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
    fetcher(`/api/users/sleep`, {
      method: "POST",
      body: JSON.stringify({ id, active }),
    }).then(() => {
      MakeUserDetailRefetch(userDetail.id);
      toast.success("Uživatel byl upraven");
    });
  };

  const onSubmit = (data: any) => {
    fetcher(`/api/users/edit/${userDetail.id}`, {
      method: "POST",
      body: JSON.stringify({
        ...data,
        birth_date: dayjs(data.birth_date).format("YYYY-MM-DD"),
        role: data.role.id,
      }),
    }).then((res) => {
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
    fetcher(`/api/users/remove-groups`, {
      method: "POST",
      body: JSON.stringify({
        user: userDetail.id,
        groups: selectGroups,
      }),
    }).then((res) => {
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
    fetcher(`/api/users/remove-reservations`, {
      method: "POST",
      body: JSON.stringify({
        user: userDetail.id,
        reservations: selectReservations,
      }),
    }).then((res) => {
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
          <div className="flex gap-2 lg:flex-row flex-col">
            <div className="flex lg:flex-col flex-row justify-between flex-wrap">
              <div className="flex gap-2">
                <AvatarWrapper size={56} data={userDetail} />
                <div className="flex flex-col">
                  <Typography variant="h6" className="font-semibold">
                    {userDetail.first_name} {userDetail.last_name}
                  </Typography>
                  <Typography>{userDetail.email}</Typography>
                </div>
              </div>
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
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 flex-col lg:flex-row">
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
                  label="Rodné číslo"
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
                      disabled={!makeEdit}
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
                          className="lg:w-40 w-full"
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
          <div className="flex gap-2 md:flex-row flex-col">
            <div className="flex flex-col">
              <Typography variant="h5">Skupiny uživatele</Typography>
              <Divider />
              <List>
                {userDetail.groups.count ? (
                  userDetail.groups.data.map((group: any) => (
                    <ListItem disablePadding key={group.id}>
                      <ListItemButton
                        sx={{ padding: 1 }}
                        disabled={group.owner.id === userDetail.id}
                        onClick={() => handleCheckGroup(group.id)}
                      >
                        <ListItemText
                          primary={<Typography>{group.name}</Typography>}
                          secondary={`Počet členů: ${group.users.length}`}
                        />
                        {group.owner.id !== userDetail.id && (
                          <Checkbox
                            disableRipple
                            checked={selectGroups.includes(group.id)}
                          />
                        )}
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
              <TableListPagination
                name="groups"
                rpp={5}
                count={userDetail.groups.count}
              />
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
              <List>
                {userDetail.reservations.count ? (
                  userDetail.reservations.data.map((reservation: any) => (
                    <ListItem disablePadding key={reservation.id}>
                      <ListItemButton
                        sx={{ padding: 1 }}
                        disabled={reservation.leader.id === userDetail.id}
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
                        {reservation.leader.id !== userDetail.id && (
                          <Checkbox
                            disableRipple
                            checked={selectReservations.includes(
                              reservation.id
                            )}
                          />
                        )}
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
              <div className="mt-auto">
                <TableListPagination
                  name="reservations"
                  rpp={5}
                  count={userDetail.reservations.count}
                />
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
          </div>
        </Paper>
      </form>
    </>
  );
}
