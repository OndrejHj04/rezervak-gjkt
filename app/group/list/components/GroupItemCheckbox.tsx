"use client";

import { store } from "@/store/store";
import { Checkbox } from "@mui/material";

export default function GroupItemCheckbox({ group }: { group: any }) {
  const { selectedGroups, setSelectedGroups } = store();

  const handleClick = () => {
    if (selectedGroups.includes(group)) {
      setSelectedGroups(selectedGroups.filter((grp: any) => grp !== group));
    } else {
      setSelectedGroups([...selectedGroups, group]);
    }
  };

  return (
    <Checkbox checked={selectedGroups.includes(group)} onClick={handleClick} />
  );
}
