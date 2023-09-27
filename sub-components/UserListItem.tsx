"use client";
import AvatarWrapper from "@/ui-components/AvatarWrapper";
import { Avatar, TableCell, TableRow } from "@mui/material";
import { User } from "next-auth";
import { useRouter } from "next/navigation";

export default function UserListItem({ user }: { user: User }) {
  const { push } = useRouter();

  return (
    <TableRow
      hover
      key={user.id}
      onClick={() => push(`/user/detail/${user.id}`)}
      sx={{ cursor: "pointer" }}
    >
      <TableCell>
        <AvatarWrapper user={user} />
      </TableCell>
      <TableCell>
        {user.first_name} {user.last_name}
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.role.role_name}</TableCell>
    </TableRow>
  );
}
