import { Group } from "@/types";
import AvatarWrapper from "@/ui-components/AvatarWrapper";
import { Button, TableCell, TableRow } from "@mui/material";

import GroupCheckbox from "./GroupCheckbox";
import Link from "next/link";

export default function GroupListItem({ group }: { group: Group }) {
  return (
    <TableRow className="cursor-pointer">
      <GroupCheckbox group={group} />
      <TableCell>{group.name}</TableCell>
      <TableCell>{group.description}</TableCell>
      <TableCell>{group.users.length}</TableCell>
      <TableCell>
        <AvatarWrapper data={group.owner} />
      </TableCell>
      <TableCell>
        <Link href={`/group/detail/${group.id}?mode=view`}>
          <Button>Detail</Button>
        </Link>
      </TableCell>
    </TableRow>
  );
}
