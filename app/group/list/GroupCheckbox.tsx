"use client";
import { store } from "@/store/store";
import { Group } from "@/types";
import { Checkbox, TableCell } from "@mui/material";

export default function GroupCheckbox({ group }: { group: Group }) {
  const { selectedGroups, setSelectedGroups } = store();

  const checked = selectedGroups.includes(group.id);

  const handleSelect = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (selectedGroups.includes(group.id)) {
      setSelectedGroups(selectedGroups.filter((id) => id !== group.id));
    } else {
      setSelectedGroups([...selectedGroups, group.id]);
    }
  };
  return (
    <TableCell>
      <Checkbox onClick={handleSelect} checked={Boolean(checked)} />
    </TableCell>
  );
}
