"use client";
import { store } from "@/store/store";
import { Checkbox } from "@mui/material";

export default function UserCheckbox({ id }: { id: any }) {
  const { selectedUsers, setSelectedUsers } = store();

  const handleSelect = (e: any) => {
    e.stopPropagation();
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  return (
    <Checkbox checked={selectedUsers.includes(id)} onClick={handleSelect} />
  );
}
