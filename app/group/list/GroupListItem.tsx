"use client";
import { Group } from "@/types";
import AvatarWrapper from "@/ui-components/AvatarWrapper";
import { Checkbox, IconButton, TableCell, TableRow } from "@mui/material";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import { store } from "@/store/store";

export default function GroupListItem({ group }: { group: Group }) {
  const { selectedGroups, setSelectedGroups } = store();
  const { push } = useRouter();
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
    <TableRow
      hover
      className="cursor-pointer"
      onClick={() => push(`/group/detail/${group.id}`)}
    >
      <TableCell>
        <Checkbox onClick={handleSelect} checked={Boolean(checked)} />
      </TableCell>
      <TableCell>{group.name}</TableCell>
      <TableCell>{group.description}</TableCell>
      <TableCell>{group.users.length}</TableCell>
      <TableCell>
        {/* <AvatarWrapper data={group.owner} /> */}
      </TableCell>
      <TableCell>
        <IconButton>
          <Diversity3Icon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
