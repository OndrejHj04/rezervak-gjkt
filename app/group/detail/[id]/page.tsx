"use client";
import { Group, GroupOwner } from "@/types";
import AvatarWrapper from "@/ui-components/AvatarWrapper";
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  Icon,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
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

interface selecteUser {
  label: string;
  value: number;
  image: string;
  first_name: string;
  last_name: string;
}

export default function Page({ params: { id } }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [group, setGroup] = useState<Group | null>(null);
  const [checked, setChecked] = useState<number[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const { control, register, handleSubmit, reset } = useForm<{ users: [] }>({
    defaultValues: { users: [] },
  });
  const [users, setUsers] = useState<User[]>([]);
  const [options, setOptions] = useState<selecteUser[]>([]);
  const { user } = store();
  const isOwner = group?.owner.id === user?.id || user?.role.role_id === 1;

  const onSubmit = ({ users }: { users: selecteUser[] }) => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/group/add-member`, {
      method: "POST",
      body: JSON.stringify({
        currentMembers: group?.users.map((user: any) => user.id),
        newMembers: users.map((user) => user.value),
        group: group?.id,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        toast.success("Uživatelé přidáni");
        getGroupDetail();
        reset();
      })
      .catch(() => {
        toast.error("Něco se nepovedlo");
      });
  };

  const getGroupDetail = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/group/detail/${id}`)
      .then((res) => res.json())
      .then((res) => {
        setGroup(res.data);
        setLoading(false);
        setChecked([]);
      })
      .catch((e) => setLoading(false));
  };

  useEffect(() => {
    if (users.length && group?.users.length) {
      const options = users
        .filter(
          (user) => !group?.users.map((user: any) => user.id).includes(user.id)
        )
        .map((user) => ({
          label: `${user.first_name} ${user.last_name}`,
          value: user.id,
          image: user.image,
          first_name: user.first_name,
          last_name: user.last_name,
        }));
      setOptions(options);
    }
  }, [users, group?.users]);

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
        getGroupDetail();
      })
      .catch((e) => toast.error("Něco se nepovedlo"));
  };

  const handleCheck = (user: GroupOwner) => {
    if (checked.includes(user.id)) {
      setChecked(checked.filter((id) => id !== user.id));
    } else {
      setChecked([...checked, user.id]);
    }
  };

  useEffect(() => {
    getGroupDetail();
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/list`)
      .then((res) => res.json())
      .then((res) => setUsers(res.data));
  }, []);

  if (loading)
    return (
      <Paper className="flex p-4 justify-center">
        <CircularProgress />
      </Paper>
    );

  if (!group) {
    return (
      <Paper className="flex w-full p-2">
        <Typography>Not found</Typography>
      </Paper>
    );
  }
  return (
    <>
      <div className="flex gap-2">
        <Paper className="flex flex-col p-2 gap-1 h-min">
          <Typography variant="h5">Majitel skupiny</Typography>
          <Divider />
          <div className="flex gap-2">
            <AvatarWrapper size={58} data={group.owner} />
            <div className="flex flex-col justify-between">
              <Typography variant="h6">
                {group.owner.first_name} {group.owner.last_name}
              </Typography>
              <Typography>{group.owner.email}</Typography>
            </div>
          </div>
        </Paper>

        {isOwner && (
          <Paper className="flex flex-col p-2 gap-1 h-min w-60">
            <Typography variant="h5">Přidat uživatele</Typography>
            <Divider />
            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                control={control}
                {...register("users")}
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    isOptionEqualToValue={(option, value) =>
                      option.value === value.value
                    }
                    filterSelectedOptions
                    disablePortal
                    value={value}
                    onChange={(e, value) => {
                      onChange(value);
                    }}
                    id="combo-box-demo"
                    multiple
                    renderOption={(props: any, option: any) => (
                      <div {...props}>
                        <Box className="flex items-center gap-2">
                          <AvatarWrapper data={option} />
                          <Typography className="ml-2">
                            {option.first_name} {option.last_name}
                          </Typography>
                        </Box>
                      </div>
                    )}
                    options={options}
                    renderInput={(params) => (
                      <TextField {...params} label="Vybrat uživatele" />
                    )}
                  />
                )}
              />
              <Button variant="outlined" type="submit" className="w-full mt-2">
                Přidat
              </Button>
            </form>
          </Paper>
        )}

        <Paper className="flex flex-col p-2 gap-0 h-min">
          <Typography variant="h5">Uživatelé ve skupině</Typography>
          <Divider />
          <List>
            {group.users.length ? (
              group.users.map((user: any) => (
                <ListItem disablePadding key={user.id}>
                  <ListItemButton
                    sx={{ padding: 1 }}
                    onClick={() => handleCheck(user)}
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
                    {isOwner && (
                      <Checkbox checked={checked.includes(user.id)} />
                    )}
                  </ListItemButton>
                </ListItem>
              ))
            ) : (
              <>
                <Typography>Žádní uživatelé ve skupině</Typography>
              </>
            )}
          </List>
          {isOwner && (
            <Button
              variant="contained"
              color="error"
              endIcon={<DeleteForeverIcon />}
              disabled={checked.length === 0}
              onClick={handleDeleteMembers}
            >
              Odebrat vybrané uživatele
            </Button>
          )}
        </Paper>
      </div>
    </>
  );
}
