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
import UsersPagination from "@/app/reservation/detail/[id]/UsersPagination";
import ReservationsPagination from "./ReservationsPagination";
import fetcher from "@/lib/fetcher";
import _ from "lodash";

interface selecteUser {
  label: string;
  value: number;
  image: string;
  first_name: string;
  last_name: string;
}

export default function GroupDetailForm({ group }: { group: any }) {
  const { push } = useRouter();
  const [checked, setChecked] = useState<number[]>([]);
  const [usersModal, setUsersModal] = useState(false);
  const [reservationModal, setReservationModal] = useState(false);
  const [selectReservation, setSelectReservation] = useState<number[]>([]);
  const {
    formState: { isDirty, dirtyFields },
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
    fetcher(`/api/group/edit/${group.id}`, {
      method: "POST",
      body: JSON.stringify({
        ...data,
      }),
    }).then((res) => {
      if (res.success) {
        toast.success("Skupina upravena");
        MakeGroupDetailRefetch(group.id);
        reset();
      } else {
        toast.error("Něco se nepovedlo");
      }
    });
  };

  const handleRemoveGroup = () => {
    fetcher(`/api/group/remove`, {
      method: "POST",
      body: JSON.stringify({
        groups: [group.id],
      }),
    }).then((res) => {
      if (res.success) toast.success("Skupina úspěšně odstraněna");
      else toast.error("Něco se nepovedlo");
      MakeGroupRefetch();
    });
  };

  const handleDeleteMembers = () => {
    fetcher(`/api/group/remove-member`, {
      method: "POST",
      body: JSON.stringify({
        group: group.id,
        members: checked,
      }),
    }).then((res) => {
      if (res.success) toast.success("Uživatelé odebráni");
      else toast.error("Něco se nepovedlo");
      setChecked([]);
      MakeGroupDetailRefetch(group.id);
    });
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
    fetcher(`/api/group/remove-reservations`, {
      method: "POST",
      body: JSON.stringify({
        group: group.id,
        reservations: selectReservation,
      }),
    }).then((res) => {
      if (res.success) toast.success("Rezervace odstraněny");
      else toast.error("Něco se nepovedlo");
      MakeGroupDetailRefetch(group.id);
      setSelectReservation([]);
    });
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
        <Paper className="flex gap-4 p-4 flex-col">
          <div className="flex gap-2">
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
              <div className="flex ">
                <Typography variant="h6">Počet členů:</Typography>
                <Chip
                  label={`${group.users.count} členů`}
                  sx={{
                    margin: "auto",
                  }}
                  icon={<Icon>group_icon</Icon>}
                />
              </div>
            </div>
            <div className="flex gap-2">
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

          <div className="flex gap-2">
            <div className="flex flex-col">
              <Typography variant="h5">Uživatelé ve skupině </Typography>
              <Divider />
              <List sx={{ height: 360 }}>
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
              <UsersPagination count={group.users.count} />
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
            <div className="flex flex-col">
              <Typography variant="h5">Rezervace skupiny </Typography>
              <Divider />
              <List sx={{ height: 360 }}>
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
              <ReservationsPagination count={group.reservations.count} />
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
        </Paper>
      </form>
    </>
  );
}
