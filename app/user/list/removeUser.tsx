"use client";
import { store } from "@/store/store";
import DeleteIcon from "@mui/icons-material/Delete";
import { Badge, IconButton } from "@mui/material";

export default function RemoveUser() {
  const { selectedUsers, setSelectedUsers } = store();

  const deleteUsers = () => {
    console.log("delete users");
  }

  return (
    <div>
      <IconButton
        disabled={!selectedUsers.length}
        sx={{ opacity: selectedUsers.length ? 1 : 0.5 }}
        onClick={deleteUsers}
      >
        <Badge badgeContent={selectedUsers.length} color="error">
          <DeleteIcon color="error" sx={{ width: 36, height: 36 }} />
        </Badge>
      </IconButton>
    </div>
  );
}
