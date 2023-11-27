"use client";

import { store } from "@/store/store";
import { Checkbox } from "@mui/material";

export default function GroupSelectAll({ groups }: { groups: any }) {
  const { selectedGroups, setSelectedGroups } = store();

  const handleSelected = () => {
    if (selectedGroups.length === groups.length) {
      setSelectedGroups([]);
    } else {
      setSelectedGroups(groups.map((user: any) => user.id));
    }
  };
  return (
    <Checkbox
      onClick={handleSelected}
      checked={
        selectedGroups.length === groups.length && Boolean(groups.length)
      }
    />
  );
}
