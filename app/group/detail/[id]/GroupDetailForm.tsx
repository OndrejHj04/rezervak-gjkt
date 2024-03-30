"use client";
import AvatarWrapper from "@/ui-components/AvatarWrapper";
import {
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
import { useState } from "react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";
import dayjs from "dayjs";
import MakeGroupRefetch from "../../list/refetch";
import { redirect, useRouter } from "next/navigation";
import MakeGroupDetailRefetch from "./refetch";
import AddUsersToGroupModal from "./AddUsersToGroupModal";
import AddGroupToReservationModal from "./AddGroupToReservationModal";
import fetcher from "@/lib/fetcher";
import _ from "lodash";
import TableListPagination from "@/ui-components/TableListPagination";
import {
  groupDetailEdit,
  groupRemoveReservations,
  groupRemoveUsers,
  removeGroups,
} from "@/lib/api";

export default function GroupDetailForm({ group }: { group: any }) {
  const { push } = useRouter();
  const [checked, setChecked] = useState<number[]>([]);
  const [usersModal, setUsersModal] = useState(false);
  const [reservationModal, setReservationModal] = useState(false);
  const [selectReservation, setSelectReservation] = useState<number[]>([]);
  const {
    formState: { isDirty },
    register,
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      name: group.name,
      description: group.description,
    },
  });

  const onSubmit = (data: any) => {
    groupDetailEdit({
      id: group.id,
      ...data,
    }).then(({ success }) => {
      if (success) {
        toast.success("Skupina upravena");
        reset({ ...data });
      } else {
        toast.error("Něco se nepovedlo");
      }
    });
  };

  const handleRemoveGroup = () => {
    removeGroups({ groups: [group.id] }).then(({ success }) => {
      success && toast.success("Skupina úspěšně odstraněna");
      !success && toast.error("Něco se nepovedlo");
    });
    //MakeGroupRefetch()
  };

  const handleDeleteMembers = () => {
    groupRemoveUsers({
      group: group.id,
      users: checked,
    }).then(({ success }) => {
      success && toast.success("Uživatelé úspěšně odebráni");
      !success && toast.error("Něco se nepovedlo");
    });
    setChecked([]);
    MakeGroupDetailRefetch(group.id);
  };

  const handleCheck = (Id: number) => {
    if (checked.includes(Id)) {
      setChecked(checked.filter((id) => id !== Id));
    } else {
      setChecked([...checked, Id]);
    }
  };

  const handleSelectReservation = (Id: number) => {
    if (selectReservation.includes(Id)) {
      setSelectReservation(selectReservation.filter((id) => id !== Id));
    } else {
      setSelectReservation([...selectReservation, Id]);
    }
  };

  const removeFromReservations = () => {
    groupRemoveReservations({
      group: group.id,
      reservations: selectReservation,
    }).then(({ success }) => {
      success && toast.success("Rezervace úspěšně odstraněny");
      !success && toast.error("Něco se nepovedlo");
    });
    MakeGroupDetailRefetch(group.id);
    setSelectReservation([]);
  };

  if (!group) {
    return (
      <Paper className="flex w-full p-2">
        <Typography>Not found</Typography>
      </Paper>
    );
  }

  return (
    <>
      {usersModal && (
        <Modal open={usersModal} onClose={() => setUsersModal(false)}>
          <AddUsersToGroupModal
            group={group}
            setModal={setUsersModal}
            currentUsers={group.users.data.map((user: any) => user.id)}
          />
        </Modal>
      )}
      {reservationModal && (
        <Modal
          open={reservationModal}
          onClose={() => setReservationModal(false)}
        >
          <AddGroupToReservationModal
            groupId={group.id}
            setModal={setReservationModal}
            currentReservations={group.reservations.data.map(
              (user: any) => user.id
            )}
          />
        </Modal>
      )}
      <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <Paper className="flex gap-4 md:p-4 p-2 flex-col">
          <div className="flex gap-2 md:flex-row flex-col">
            <div className="flex flex-col gap-1">
              <Typography variant="h5">Vedoucí skupiny</Typography>
              <div className="flex gap-2">
                <AvatarWrapper size={56} data={group.owner as any} />
                <div className="flex flex-col">
                  <Typography variant="h6" className="font-semibold">
                    {group.owner.first_name} {group.owner.last_name}
                  </Typography>
                  <Typography>{group.owner.email}</Typography>
                </div>
              </div>
              <div className="flex">
                <Typography variant="h6">Počet členů:</Typography>
                <Chip
                  className="ml-2"
                  label={`${group.users.count} členů`}
                  icon={<Icon>group_icon</Icon>}
                />
              </div>
            </div>
            <div className="flex gap-2 md:flex-row flex-col">
              <TextField label="Jméno" {...register("name")} />
              <TextField
                {...register("description")}
                multiline
                label="Popis skupiny"
                minRows={4}
                maxRows={4}
              />
            </div>
            <div className="flex flex-col gap-2 ml-auto">
              <Button
                variant="outlined"
                color="error"
                onClick={handleRemoveGroup}
              >
                Odstranit
              </Button>
              <Button variant="outlined" type="submit" disabled={!isDirty}>
                Uložit
              </Button>
            </div>
          </div>

          <div className="flex md:flex-row flex-col gap-3">
            <div className="flex flex-col">
              <Typography variant="h5">Uživatelé ve skupině </Typography>
              <Divider />
              <List>
                {group.users.count ? (
                  group.users.data.map((user: any) => (
                    <ListItem disablePadding key={user.id}>
                      <ListItemButton
                        sx={{ padding: 1 }}
                        disabled={group.owner.id === user.id}
                        onClick={() => handleCheck(user.id)}
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
                        {group.owner.id !== user.id && (
                          <Checkbox
                            disableRipple
                            disabled={group.owner.id === user.id}
                            checked={checked.includes(user.id)}
                          />
                        )}
                        <IconButton
                          onClick={(e) => push(`/user/detail/${user.id}`)}
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
              <div className="mt-auto">
                <TableListPagination
                  count={group.users.count}
                  name="users"
                  rpp={5}
                />
                <div className="flex flex-col gap-2">
                  <Button
                    variant="contained"
                    color="error"
                    endIcon={<DeleteForeverIcon />}
                    disabled={checked.length === 0}
                    onClick={handleDeleteMembers}
                  >
                    Odebrat vybrané uživatele ze skupiny
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => setUsersModal(true)}
                    endIcon={<AddToPhotosIcon />}
                  >
                    Přidat uživatele do skupiny
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <Typography variant="h5">Rezervace skupiny </Typography>
              <Divider />
              <List>
                {group.reservations.count ? (
                  group.reservations.data.map((reservation: any) => (
                    <ListItem disablePadding key={reservation.id}>
                      <ListItemButton
                        sx={{ padding: 1 }}
                        onClick={() => handleSelectReservation(reservation.id)}
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
                          checked={selectReservation.includes(reservation.id)}
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
                    <Typography>Žádné rezervace skupiny</Typography>
                  </>
                )}
              </List>
              <div className="mt-auto">
                <TableListPagination
                  rpp={5}
                  name="reservations"
                  count={group.reservations.count}
                />
                <div className="flex flex-col gap-2">
                  <Button
                    variant="contained"
                    color="error"
                    endIcon={<DeleteForeverIcon />}
                    disabled={!selectReservation.length}
                    onClick={() => removeFromReservations()}
                  >
                    Odpojit vybrané rezervace
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => setReservationModal(true)}
                    endIcon={<AddToPhotosIcon />}
                  >
                    Připojit rezervaci ke skupině
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Paper>
      </form>
    </>
  );
}
