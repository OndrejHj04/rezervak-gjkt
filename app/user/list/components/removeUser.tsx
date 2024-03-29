"use client";
import { store } from "@/store/store";
import DeleteIcon from "@mui/icons-material/Delete";
import { Badge, IconButton } from "@mui/material";
import { toast } from "react-toastify";
import MakeUserListRefetch from "../refetch";
import { usersDelete } from "@/lib/api";

export default function RemoveUser() {
  const { selectedUsers, setSelectedUsers } = store();

  const deleteUsers = () => {
    usersDelete({ users: selectedUsers }).then(({ success }) => {
      success && toast.success("Uživatelé úspěšně odstraněni");
      !success && toast.error("Něco se nepovedlo");
    });
    setSelectedUsers([]);
    MakeUserListRefetch("/user/list");
  };

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
