import AvatarWrapper from "@/ui-components/AvatarWrapper";
import { Button, TableCell, TableRow } from "@mui/material";

import Link from "next/link";
import { rolesConfig } from "@/lib/rolesConfig";
import GroupItemCheckbox from "./GroupItemCheckbox";

export default function GroupListItem({
  group,
  userRole,
  userId,
}: {
  group: any;
  userRole: any;
  userId: any;
}) {
  const isMember = group.users.includes(userId);

  return (
    <TableRow className="cursor-pointer">
      {rolesConfig.groups.modules.groupsTable.config.topbar.delete.includes(
        userRole
      ) && (
          <TableCell>
            <GroupItemCheckbox group={group.id} />
          </TableCell>
        )}
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
