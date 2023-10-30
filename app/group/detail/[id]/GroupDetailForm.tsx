"use client";
import { Group, GroupOwner } from "@/types";
import AvatarWrapper from "@/ui-components/AvatarWrapper";
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
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
import { useEffect, useState } from "react";
import { User } from "next-auth";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { toast } from "react-toastify";
import { Controller, set, useForm } from "react-hook-form";
import { store } from "@/store/store";
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";
import dayjs from "dayjs";
import MakeRefetch from "../../list/refetch";
import { useRouter } from "next/navigation";
import MakeGroupDetailRefetch from "./refetch";
import AddUsersToGroupModal from "./AddUsersToGroupModal";

interface selecteUser {
  label: string;
  value: number;
  image: string;
  first_name: string;
  last_name: string;
}

export default function GroupDetailForm({ group }: { group: Group }) {
  const { push } = useRouter();
  const [checked, setChecked] = useState<number[]>([]);
  const [usersModal, setUsersModal] = useState(false);
  const {
    formState: { isDirty },
    register,
    handleSubmit,
    reset,
  } = useForm();

  const onSubmit = (data: any) => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/group/edit/${group.id}`, {
      method: "POST",
      body: JSON.stringify({
        ...data,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        toast.success("Skupina upravena");
        reset();
      })
      .catch((e) => toast.error("Něco se nepovedlo"));
  };

  const handleRemoveGroup = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/group/remove`, {
      method: "POST",
      body: JSON.stringify({
        groups: [group.id],
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        toast.success("Skupina úspěšně odstraněna");
      })
      .catch((e) => toast.error("Něco se nepovedlo"))
      .finally(() => {
        MakeRefetch();
      });
  };

  const handleDeleteMembers = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/group/remove-member`, {
      method: "POST",
      body: JSON.stringify({
        group: group?.id,
        currentMembers: group?.users.map((user: any) => user.id),
        membersForRemove: checked,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        toast.success("Uživatelé odebráni");
      })
      .catch((e) => toast.error("Něco se nepovedlo"))
      .finally(() => {
        MakeGroupDetailRefetch(group.id);
        setChecked([]);
      });
  };

  const handleCheck = (Id: number) => {
    if (checked.includes(Id)) {
      setChecked(checked.filter((id) => id !== Id));
    } else {
      setChecked([...checked, Id]);
    }
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
            groupId={group.id}
            setModal={setUsersModal}
            currentUsers={group.users.map((user: any) => user.id)}
          />
        </Modal>
      )}
      <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-2 ml-auto flex gap-2">
          <Button variant="outlined" color="error" onClick={handleRemoveGroup}>
            Odstranit
          </Button>
          <Button variant="outlined" type="submit" disabled={!isDirty}>
            Uložit
          </Button>
        </div>
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
                  label={`${group.users.length} členů`}
                  sx={{
                    margin: "auto",
                  }}
                  icon={<Icon>group_icon</Icon>}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <TextField
                label="Jméno"
                {...register("name")}
                defaultValue={group.name}
              />
              <TextField
                {...register("description")}
                defaultValue={group.description}
                multiline
                label="Popis skupiny"
                minRows={4}
                maxRows={4}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex flex-col">
              <Typography variant="h5">
                Uživatelé ve skupině{" "}
                {group.users.length && <span>({group.users.length})</span>}
              </Typography>
              <Divider />
              <List sx={{ height: 400 }}>
                {group.users.length ? (
                  group.users.map((user: any) => (
                    <ListItem disablePadding key={user.id}>
                      <ListItemButton
                        sx={{ padding: 1 }}
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
                        <Checkbox
                          disableRipple
                          checked={checked.includes(user.id)}
                        />
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
              <Typography variant="h5">
                Rezervace skupiny{" "}
                {group.reservations.length && (
                  <span>({group.reservations.length})</span>
                )}
              </Typography>
              <Divider />
              <List sx={{ height: 400 }}>
                {group.reservations.length ? (
                  group.reservations.map((reservation: any) => (
                    <ListItem disablePadding key={reservation.id}>
                      <ListItemButton sx={{ padding: 1 }} onClick={() => {}}>
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
                        <Checkbox disableRipple />
                        <IconButton
                          onClick={(e) =>
                            push(`/reservations/detail/${reservation.id}`)
                          }
                        >
                          <Icon>info_icon</Icon>
                        </IconButton>
                      </ListItemButton>
                    </ListItem>
                  ))
                ) : (
                  <>
                    <Typography>Žádní rezervace skupiny</Typography>
                  </>
                )}
              </List>
              <div className="flex flex-col gap-2">
                <Button
                  variant="contained"
                  color="error"
                  endIcon={<DeleteForeverIcon />}
                  disabled
                  onClick={() => {}}
                >
                  Odebrat z vybraných rezervací
                </Button>
              </div>
            </div>
          </div>
        </Paper>
      </form>
    </>
  );
}
