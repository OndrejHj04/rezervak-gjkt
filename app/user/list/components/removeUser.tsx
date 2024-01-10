"use client";
import { store } from "@/store/store";
import DeleteIcon from "@mui/icons-material/Delete";
import { Badge, IconButton } from "@mui/material";
import { toast } from "react-toastify";
import MakeUserListRefetch from "../refetch";

export default function RemoveUser() {
  const { selectedUsers, setSelectedUsers } = store();

  const deleteUsers = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/delete`, {
      method: "POST",
      body: JSON.stringify({ users: selectedUsers }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast.success("Uživatelé byli úspěšně smazáni");
        } else {
          toast.error("Něco se pokazilo");
        }
        setSelectedUsers([]);
        MakeUserListRefetch("/user/list");
      });
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
