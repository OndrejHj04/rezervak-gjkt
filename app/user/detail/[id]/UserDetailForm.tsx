"use client";
import { Role } from "@/types";
import AvatarWrapper from "@/ui-components/AvatarWrapper";
import {
  Alert,
  Autocomplete,
  Button,
  Checkbox,
  Divider,
  Icon,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Modal,
  Paper,
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
import TableListPagination from "@/ui-components/TableListPagination";
import {
  editUserDetail,
  makeUserSleep,
  userRemoveChildren,
  userRemoveGroups,
  userRemoveReservations,
} from "@/lib/api";
import AddChildrenModal from "./AddChildrenModal";

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
    formState: { isDirty },
    setValue,
  } = useForm();
  const { push } = useRouter();

  const [selectGroups, setSelectGroups] = useState<number[]>([]);
  const [selectReservations, setSelectReservation] = useState<number[]>([]);
  const [selectChildren, setSelectChildren] = useState<number[]>([]);
  const [groupsModal, setGroupsModal] = useState(false);
  const [reservationsModal, setReservationsModal] = useState(false);
  const [childrenModal, setChildrenModal] = useState(false);
  const makeEdit = rolesConfig.users.modules.userDetail.edit.includes(userRole);

  const handleUserSleep = (id: any, active: any) => {
    makeUserSleep({ id, active }).then(({ success, msg }) => {
      success && toast.success(msg);
      !success && toast.error("Něco se nepovedlo");
    });
    MakeUserDetailRefetch(userDetail.id);
  };

  const onSubmit = (data: any) => {
    editUserDetail({
      id: userDetail.id,
      user: {
        ...data,
        birth_date: dayjs(data.birth_date).format("YYYY-MM-DD"),
        role: data.role.id,
        organization: data.organization.id,
      },
    }).then(({ success }) => {
      success && toast.success("Detail uživatele upraven");
      !success && toast.error("Něco se nepovedlo");
    });
    MakeUserDetailRefetch(userDetail.id);
    setValue("birth_date", data.birth_date);
  };

  const handleCheckGroup = (id: number) => {
    if (selectGroups.includes(id)) {
      setSelectGroups(selectGroups.filter((group) => group !== id));
    } else {
      setSelectGroups([...selectGroups, id]);
    }
  };

  const removeGroups = () => {
    userRemoveGroups({ user: userDetail.id, groups: selectGroups }).then(
      ({ success }) => {
        success && toast.success("Skupiny úspěšně odebrány");
        !success && toast.error("Něco se nepovedlo");
      }
    );
    setSelectGroups([]);
    MakeUserDetailRefetch(userDetail.id);
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

  const handleCheckChildren = (id: number) => {
    if (selectChildren.includes(id)) {
      setSelectChildren(
        selectChildren.filter((reservation) => reservation !== id)
      );
    } else {
      setSelectChildren([...selectChildren, id]);
    }
  };

  const removeReservations = () => {
    userRemoveReservations({
      user: userDetail.id,
      reservations: selectReservations,
    }).then(({ success }) => {
      success && toast.success("Rezervace úspěšně odebrány");
      !success && toast.error("Něco se nepovedlo");
    });
    setSelectReservation([]);
    MakeUserDetailRefetch(userDetail.id);
  };

  const removeChildren = () => {
    userRemoveChildren({
      user: userDetail.id,
      children: selectChildren,
    }).then(({ success }) => {
      success && toast.success("Dětské účty úspěšně odpojeny");
      !success && toast.error("Něco se nepovedlo");
    });
    setSelectChildren([]);
    MakeUserDetailRefetch(userDetail.id);
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
      {childrenModal && (
        <Modal open={childrenModal} onClose={() => setChildrenModal(false)}>
          <AddChildrenModal
            currentChildren={userDetail.children.data}
            setModal={setChildrenModal}
            userId={userDetail.id}
          />
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
                <Controller
                  control={control}
                  name="organization"
                  defaultValue={userDetail.organization}
                  render={({ field: { value, onChange } }) => (
                    <Autocomplete
                      value={value}
                      disabled={!makeEdit}
                      isOptionEqualToValue={(option, value) =>
                        option.id === value.id
                      }
                      options={[
                        { id: 1, name: "ZO" },
                        { id: 2, name: "Zaměstnanec" },
                        { id: 3, name: "Veřejnost" },
                      ]}
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
                          label="Vztah k organizaci"
                          className="lg:w-48 w-full"
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
                    handleUserSleep(userDetail.id, userDetail.active)
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
              <div className="mt-auto">
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

            <div className="flex flex-col">
              <Typography variant="h5">Dětské účty uživatele</Typography>
              <Divider />
              <List>
                {userDetail.children.count ? (
                  userDetail.children.data.map((child: any) => (
                    <ListItem disablePadding key={child.id}>
                      <ListItemButton
                        sx={{ padding: 1 }}
                        onClick={() => handleCheckChildren(child.id)}
                      >
                        <ListItemText
                          primary={
                            <Typography>
                              {child.first_name} {child.last_name}
                            </Typography>
                          }
                          secondary={child.email}
                        />
                        <Checkbox
                          disableRipple
                          checked={selectChildren.includes(child.id)}
                        />
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            push(`/user/detail/${child.id}`);
                          }}
                        >
                          <Icon>info_icon</Icon>
                        </IconButton>
                      </ListItemButton>
                    </ListItem>
                  ))
                ) : (
                  <>
                    <Typography>Žádné dětské účty uživatele</Typography>
                  </>
                )}
              </List>
              <div className="mt-auto">
                <TableListPagination
                  name="children"
                  rpp={5}
                  count={userDetail.children.count}
                />
                {makeEdit && (
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="contained"
                      color="error"
                      endIcon={<DeleteForeverIcon />}
                      disabled={!selectChildren.length}
                      onClick={removeChildren}
                    >
                      Odpojit vybrané dětské účty
                    </Button>
                    <Button
                      variant="contained"
                      endIcon={<AddToPhotosIcon />}
                      onClick={() => setChildrenModal(true)}
                    >
                      Přidat uživateli dětské účty
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
