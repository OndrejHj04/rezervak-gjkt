"use client";
import AvatarWrapper from "@/ui-components/AvatarWrapper";
import {
  Button,
  ButtonBase,
  CardHeader,
  Divider,
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
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import AddUsersToGroupModal from "./AddUsersToGroupModal";
import _ from "lodash";
import TableListPagination from "@/ui-components/TableListPagination";
import {
  groupDetailEdit,
  groupRemoveUsers,
  removeGroups,
} from "@/lib/api";
import Link from "next/link";

export default function GroupDetailForm({ group }: { group: any }) {
  const { push } = useRouter();
  const [checked, setChecked] = useState<any[]>([]);
  const [usersModal, setUsersModal] = useState(false);
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

  const { refresh } = useRouter()
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
    refresh()
  };

  const handleRemoveGroup = () => {
    removeGroups({ groups: [group.id] }).then(({ success }) => {
      success && toast.success("Skupina úspěšně odstraněna");
      !success && toast.error("Něco se nepovedlo");
    });
    push("/group/list");
  };

  const handleDeleteMembers = () => {
    groupRemoveUsers({
      group: group.id,
      users: checked,
    }).then(({ success }) => {
      success && toast.success("Uživatelé úspěšně odebráni");
      !success && toast.error("Něco se nepovedlo");
    });
    setChecked([])
    refresh()
  };

  const handleCheck = (Id: any) => {
    if (checked.includes(Id)) {
      setChecked(checked.filter((id: any) => id !== Id));
    } else {
      setChecked([...checked, Id]);
    }
  };

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
      <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <Paper className="flex md:p-3 p-1 gap-3 flex-col">
          <div className="flex md:flex-row flex-col md:gap-1 gap-3">
            <div>
              <Typography variant="h5">Vedoucí skupiny: </Typography>
              <ButtonBase className="mr-auto">
                <CardHeader component={Link} href={`/user/detail/${group.owner.id}`} className="!p-0 text-inherit no-underline text-left" titleTypographyProps={{ variant: "h5" }} avatar={<AvatarWrapper size={48} data={group.owner as any} />} title={`${group.owner.first_name} ${group.owner.last_name}`} subheader={group.owner.email} />
              </ButtonBase>
            </div>
            <TextField label="Jméno" {...register("name")} />
            <TextField
              {...register("description")}
              label="Popis skupiny"
            />
            <div className="flex flex-col gap-2 md:ml-auto">
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

          <div className="flex md:flex-row flex-col gap-2">
            <div className="flex flex-col">
              <Typography variant="h5" className="text-center">Uživatelé ve skupině</Typography>
              <Divider />
              <List>
                {group.users.data.map((user: any) => (
                  <ListItem disablePadding key={user.id}>
                    <ListItemButton
                      className="[&]:!opacity-100 !py-0.5 px-2"
                      disabled={group.owner.id === user.id}
                      selected={checked.includes(user.id)}
                      onClick={() => handleCheck(user.id)}
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
                ))}
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
                    disabled={checked.length === 0}
                    onClick={handleDeleteMembers}
                    size="small"
                  >
                    Odebrat vybrané uživatele ze skupiny
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => setUsersModal(true)}
                    size="small"
                  >
                    Přidat uživatele do skupiny
                  </Button>
                </div>
              </div>
            </div>
            <Divider flexItem orientation="vertical" />
            <div className="flex flex-col">
              <Typography variant="h5" className="text-center">Rezervace skupiny </Typography>
              <Divider />
              <List>
                {group.reservations.data.map((reservation: any) => (
                  <ListItem disablePadding key={reservation.id}>
                    <ListItemText
                      primary={reservation.name}
                      secondary={`${dayjs(reservation.from_date).format(
                        "DD.MM.YYYY"
                      )} - ${dayjs(reservation.to_date).format(
                        "DD.MM.YYYY"
                      )}`}
                    />
                  </ListItem>
                ))
                }
              </List>
              <div className="mt-auto">
                <TableListPagination
                  rpp={5}
                  name="reservations"
                  count={group.reservations.count}
                />
              </div>
            </div>
          </div>
        </Paper>
      </form>
    </>
  );
}
