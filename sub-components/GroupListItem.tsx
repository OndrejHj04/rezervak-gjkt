"use client";
import { Group } from "@/types";
import AvatarWrapper from "@/ui-components/AvatarWrapper";
import { IconButton, TableCell, TableRow } from "@mui/material";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import { useRouter } from "next/navigation";

export default function GroupListItem({ group }: { group: Group }) {
  const { push } = useRouter();
  
  return (
    <TableRow hover onClick={() => push(`/group/detail/${group.id}`)}>
      <TableCell>{group.name}</TableCell>
      <TableCell>{group.description}</TableCell>
      <TableCell>{group.users.length}</TableCell>
      <TableCell>
        <AvatarWrapper data={group.owner} />
      </TableCell>
      <TableCell>
        <IconButton>
          <Diversity3Icon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
