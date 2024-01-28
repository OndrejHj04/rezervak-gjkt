import AvatarWrapper from "@/ui-components/AvatarWrapper";
import {
  Box,
  Button,
  Chip,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { User } from "next-auth";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import dayjs from "dayjs";
import HotelIcon from "@mui/icons-material/Hotel";
import Link from "next/link";
import TableListCheckbox from "@/ui-components/TableListCheckbox";
import { rolesConfig } from "@/rolesConfig";

export default function UserListItem({
  user,
  userRole,
  userId,
}: {
  user: User;
  userRole: any;
  userId: any;
}) {
  const cells = rolesConfig.users.modules.userTable.columns[
    userRole as never
  ] as any;

  return (
    <TableRow key={user.id}>
      {rolesConfig.users.modules.userTable.config.delete.includes(userRole) && (
        <TableListCheckbox prop="users" id={user.id} />
      )}
      <TableCell>
        <AvatarWrapper data={user} />
      </TableCell>
      {cells.includes("name") && (
        <TableCell>
          {user.first_name} {user.last_name}
        </TableCell>
      )}
      {cells.includes("email") && <TableCell>{user.email}</TableCell>}
      {cells.includes("role") && (
        <TableCell>
          <Typography variant="subtitle2">{user.role.name}</Typography>
        </TableCell>
      )}
      {cells.includes("birth_date") && (
        <TableCell>
          {user.birth_date && dayjs(user.birth_date).format("DD.MM.YYYY")}
        </TableCell>
      )}
      {cells.includes("verified") && (
        <TableCell>
          {user.verified ? (
            <CheckCircleIcon color="success" sx={{ width: 32, height: 32 }} />
          ) : (
            <CancelIcon color="error" sx={{ width: 32, height: 32 }} />
          )}
        </TableCell>
      )}
      {rolesConfig.users.modules.userDetail.visit.includes(userRole) ||
      (userId === user.id &&
        rolesConfig.users.modules.userDetail.visitSelf.includes(userRole)) ? (
        <TableCell>
          <Link href={`/user/detail/${user.id}`}>
            <Button>Detail</Button>
          </Link>
        </TableCell>
      ) : (
        <TableCell />
      )}
    </TableRow>
  );
}
