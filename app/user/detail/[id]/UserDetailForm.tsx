"use client";
import { Role } from "@/types";
import AvatarWrapper from "@/ui-components/AvatarWrapper";
import {
  Alert,
  Autocomplete,
  Button,
  CardHeader,
  Checkbox,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { DateField, DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
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
} from "@/lib/api";
import AddChildrenModal from "./AddChildrenModal";

const rowsPerPage = 5
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
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <Paper className="md:p-3 p-1 flex flex-col gap-3">
          <div className="flex md:gap-1 gap-3 md:flex-row flex-col">
            <div className="flex flex-col justify-between w-fit">
              <CardHeader className="!p-0" titleTypographyProps={{ variant: "h5" }} avatar={<AvatarWrapper size={56} data={userDetail} />} title={`${userDetail.first_name} ${userDetail.last_name}`} subheader={userDetail.email} />
              {!userDetail.verified ? (
                <Alert severity="error">
                  Neověřený uživatel
                </Alert>
              ) : (
                <Alert severity="success">
                  Ověřený uživatel
                </Alert>
              )}
            </div>
            <div className="grid sm:grid-rows-2 sm:grid-cols-3 gap-3 grid-rows-3 grid-cols-2">
              <Controller
                control={control}
                name="birth_date"
                defaultValue={
                  userDetail.birth_date && dayjs(userDetail.birth_date)
                }
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="Datum narození"
                    format="DD.MM.YYYY"
                  />
                )}
              />
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
                      />
                    )}
                  />
                )}
              />
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
                {userDetail.groups.data.map((group: any) => (
                  <ListItem disablePadding key={group.id}>
                    <ListItemButton
                      className="!p-0"
                      onClick={() => handleCheckGroup(group.id)}
                    >
                      <ListItemText
                        primary={<Typography>{group.name}</Typography>}
                        secondary={`Počet členů: ${group.users.length}`}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
              <div className="mt-auto">
                <TableListPagination
                  name="groups"
                  rpp={rowsPerPage}
                  count={userDetail.groups.count}
                />
              </div>
            </div>
            <Divider orientation="vertical" flexItem />
            <div className="flex flex-col">
              <Typography variant="h5">Rezervace uživatele</Typography>
              <Divider />
              <List>
                {userDetail.reservations.data.map((reservation: any) => (
                  <ListItem disablePadding key={reservation.id}>
                    <ListItemButton
                      className="!p-0"
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
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
              <div className="mt-auto">
                <TableListPagination
                  name="reservations"
                  rpp={rowsPerPage}
                  count={userDetail.reservations.count}
                />
              </div>
            </div>
            <Divider orientation="vertical" flexItem />
            <div className="flex flex-col">
              <Typography variant="h5">Dětské účty uživatele</Typography>
              <Divider />
              <List>
                {userDetail.children.data.map((child: any) => (
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
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
              <div className="mt-auto">
                <TableListPagination
                  name="children"
                  rpp={rowsPerPage}
                  count={userDetail.children.count}
                />
                {makeEdit && (
                  <div className="flex flex-col gap-2">
                    <Button
                      size="small"
                      variant="contained"
                      color="error"
                      endIcon={<DeleteForeverIcon />}
                      disabled={!selectChildren.length}
                      onClick={removeChildren}
                    >
                      Odpojit vybrané dětské účty
                    </Button>
                    <Button
                      size="small"
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
