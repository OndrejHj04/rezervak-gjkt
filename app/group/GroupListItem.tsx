import { Group } from "@/types";
import AvatarWrapper from "@/ui-components/AvatarWrapper";
import { Avatar, TableCell, TableRow, Typography } from "@mui/material";
import { User } from "next-auth";
import { useEffect, useState } from "react";

export default function GroupListItem({ group }: { group: Group }) {
  return (
    <TableRow hover>
      <TableCell>{group.name}</TableCell>
      <TableCell>{group.description}</TableCell>
      <TableCell>{group.users.length}</TableCell>
      <TableCell>
        <AvatarWrapper data={group.owner} />
      </TableCell>
    </TableRow>
  );
}
