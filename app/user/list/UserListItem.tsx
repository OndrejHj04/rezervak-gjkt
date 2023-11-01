"use client";
import AvatarWrapper from "@/ui-components/AvatarWrapper";
import {
  Box,
  Button,
  Checkbox,
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
import SecurityIcon from "@mui/icons-material/Security";
import BuildIcon from "@mui/icons-material/Build";
import PersonIcon from "@mui/icons-material/Person";
import PublicIcon from "@mui/icons-material/Public";
import { useRouter } from "next/navigation";
import { store } from "@/store/store";
import HotelIcon from "@mui/icons-material/Hotel";

export default function UserListItem({ user }: { user: User }) {
  const { push } = useRouter();
  const { selectedUsers, setSelectedUsers } = store();
  const iconMap: { [key: string]: JSX.Element } = {
    SecurityIcon: <SecurityIcon />,
    BuildIcon: <BuildIcon />,
    PersonIcon: <PersonIcon />,
    PublicIcon: <PublicIcon />,
  };

  const handleSelect = (e: any) => {
    e.stopPropagation();
    if (selectedUsers.includes(user.id)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user.id]);
    }
  };

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
      disableHoverListener={user.active}
      followCursor
    >
      <TableRow
        hover
        key={user.id}
        sx={{ cursor: "pointer", opacity: user.active ? 1 : 0.5 }}
        onClick={() => push(`/user/detail/${user.id}`)}
      >
        <TableCell>
          <Checkbox
            checked={selectedUsers.includes(user.id)}
            onClick={handleSelect}
          />
        </TableCell>
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
              <Typography variant="subtitle2">{user.role.role_name}</Typography>
            }
            deleteIcon={iconMap[user.role.icon]}
          />
        </TableCell>
        <TableCell>
          {(user.birth_date && dayjs(user.birth_date).format("DD.MM.YYYY")) ||
            "N/A"}
        </TableCell>
        <TableCell>
          {user.verified ? (
            <CheckCircleIcon color="success" sx={{ width: 32, height: 32 }} />
          ) : (
            <CancelIcon color="error" sx={{ width: 32, height: 32 }} />
          )}
        </TableCell>
      </TableRow>
    </Tooltip>
  );
}
