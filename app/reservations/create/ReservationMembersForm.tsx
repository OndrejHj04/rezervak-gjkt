import { Group } from "@/types";
import AvatarWrapper from "@/ui-components/AvatarWrapper";
import {
  Avatar,
  Checkbox,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { User } from "next-auth";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

export default function ReservationMembersForm({
  groups,
  users,
}: {
  groups: Group[];
  users: User[];
}) {
  const { setValue, watch } = useFormContext();
  const selectedUsers = watch("users");

  const handleGroupCheck = (group: Group | any) => {
    const allSelected = group.users.every((id: any) =>
      selectedUsers.includes(id)
    );
    if (allSelected) {
      setValue(
        "users",
        selectedUsers.filter((id: any) => !group.users.includes(id))
      );
    } else {
      const mergedUsers: any = Array.from(
        new Set(selectedUsers.concat(group.users))
      );
      setValue("users", mergedUsers);
    }
  };

  const handleUserCheck = (userId: number) => {
    if (selectedUsers.includes(userId)) {
      setValue(
        "users",
        selectedUsers.filter((id: any) => id !== userId)
      );
    } else {
      setValue("users", [...selectedUsers, userId]);
    }
  };

  return (
    <Paper className="p-2">
      <Typography variant="h5">Účastníci: {selectedUsers.length}</Typography>
      <Typography variant="h6">Skupiny</Typography>
      <List>
        {groups.map((group) => {
          const allSelected = group.users.every((id: any) =>
            selectedUsers.includes(id)
          );

          return (
            <ListItem key={group.id} disablePadding>
              <ListItemButton onClick={() => handleGroupCheck(group)}>
                <ListItemAvatar>
                  <Avatar>{group.name[0]}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={group.name}
                  secondary={`Počet členů: ${group.users.length}`}
                />
                <Checkbox
                  disableRipple
                  checked={allSelected}
                  indeterminate={
                    !allSelected &&
                    group.users.some((id: any) => selectedUsers.includes(id))
                  }
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Typography variant="h6">Uživatelé</Typography>
      <List>
        {users.map((user) => (
          <ListItem key={user.id} disablePadding>
            <ListItemButton onClick={() => handleUserCheck(user.id)}>
              <ListItemAvatar>
                <AvatarWrapper data={user} />
              </ListItemAvatar>
              <ListItemText
                primary={`${user.first_name} ${user.last_name}`}
                secondary={user.email}
              />
              <Checkbox
                disableRipple
                checked={selectedUsers.includes(user.id)}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
