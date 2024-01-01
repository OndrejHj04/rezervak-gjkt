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
}: {
  user: User;
  userRole: any;
}) {
  const sleepingUser = (
    <Box className="flex items-center gap-2">
      <HotelIcon sx={{ color: "#4579ac", fontSize: 36 }} />
      <Typography variant="h6">Pššš! Tento účet spí.</Typography>
      <HotelIcon sx={{ color: "#4579ac", fontSize: 36 }} />
    </Box>
  );
  return (
    <Tooltip
      title={sleepingUser}
      sx={{ opacity: user.active ? 1 : 0.5 }}
      disableHoverListener={user.active}
      followCursor
    >
      <TableRow key={user.id}>
        {rolesConfig.users.table.delete.includes(userRole) && (
          <TableListCheckbox prop="users" id={user.id} />
        )}
        <TableCell>
          <AvatarWrapper data={user} />
        </TableCell>
        <TableCell>
          {user.first_name} {user.last_name}
        </TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>
          <Chip
            label={
              <Typography variant="subtitle2">{user.role.name}</Typography>
            }
          />
        </TableCell>
        <TableCell>
          {user.birth_date && dayjs(user.birth_date).format("DD.MM.YYYY")}
        </TableCell>
        <TableCell>
          {user.verified ? (
            <CheckCircleIcon color="success" sx={{ width: 32, height: 32 }} />
          ) : (
            <CancelIcon color="error" sx={{ width: 32, height: 32 }} />
          )}
        </TableCell>
        {rolesConfig.users.table.detail.includes(userRole) && (
          <TableCell>
            <Link href={`/user/detail/${user.id}`}>
              <Button>Detail</Button>
            </Link>
          </TableCell>
        )}
      </TableRow>
    </Tooltip>
  );
}
