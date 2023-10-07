"use client";
import { Group, GroupOwner } from "@/types";
import AvatarWrapper from "@/ui-components/AvatarWrapper";
import {
  Autocomplete,
  Avatar,
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
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import AddUserToGroupModal from "../../modal/AddUserToGroupModal";
import { User } from "next-auth";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { toast } from "react-toastify";
import { set } from "react-hook-form";

export default function Page({ params: { id } }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [group, setGroup] = useState<Group | null>(null);
  const [checked, setChecked] = useState<number[]>([]);

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

  const handleDeleteMembers = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/group/remove-member`, {
      method: "POST",
      body: JSON.stringify({
        group: group?.id,
        currentMembers: group?.users.map((user) => user.id),
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

        <Paper className="flex flex-col p-2 gap-1 h-min">
          <Typography variant="h5">Přidat uživatele</Typography>
          <Divider />
          <Button variant="outlined">Přidat</Button>
        </Paper>

        <Paper className="flex flex-col p-2 gap-0 h-min">
          <Typography variant="h5">Uživatelé ve skupině</Typography>
          <Divider />
          <List>
            {group.users.length ? (
              group.users.map((user) => (
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
                    <Checkbox checked={checked.includes(user.id)} />
                  </ListItemButton>
                </ListItem>
              ))
            ) : (
              <>
                <Typography>Žádní uživatelé ve skupině</Typography>
              </>
            )}
          </List>
          <Button
            variant="contained"
            color="error"
            endIcon={<DeleteForeverIcon />}
            disabled={checked.length === 0}
            onClick={handleDeleteMembers}
          >
            Odebrat vybrané uživatele
          </Button>
        </Paper>
      </div>
    </>
  );
}
