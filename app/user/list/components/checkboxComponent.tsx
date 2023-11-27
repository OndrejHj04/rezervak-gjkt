"use client";

import { store } from "@/store/store";
import { Checkbox } from "@mui/material";

export default function CheckboxComponent({ users }: { users: any[] }) {
  const { selectedUsers, setSelectedUsers } = store();
  console.log(users);
  const handleSelected = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((user) => user.id));
    }
  };

  return <Checkbox onClick={handleSelected} />;
}
