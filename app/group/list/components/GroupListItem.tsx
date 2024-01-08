import { Group } from "@/types";
import AvatarWrapper from "@/ui-components/AvatarWrapper";
import { Button, TableCell, TableRow } from "@mui/material";

import Link from "next/link";
import TableListCheckbox from "@/ui-components/TableListCheckbox";
import { rolesConfig } from "@/rolesConfig";

export default function GroupListItem({
  group,
  userRole,
  userId,
}: {
  group: Group;
  userRole: any;
  userId: any;
}) {
  const isMember = group.users.includes(userId);

  return (
    <TableRow className="cursor-pointer">
      <TableCell>{group.name}</TableCell>
      <TableCell>{group.description}</TableCell>
      <TableCell>{group.users.length}</TableCell>
      <TableCell>
        <AvatarWrapper data={group.owner} />
      </TableCell>
      {rolesConfig.groups.modules.groupsDetail.visit.includes(userRole) ||
      (isMember &&
        rolesConfig.groups.modules.groupsDetail.visitSelf.includes(
          userRole
        )) ? (
        <TableCell>
          <Link href={`/group/detail/${group.id}?mode=view`}>
            <Button>Detail</Button>
          </Link>
        </TableCell>
      ) : (
        <TableCell />
      )}
    </TableRow>
  );
}
