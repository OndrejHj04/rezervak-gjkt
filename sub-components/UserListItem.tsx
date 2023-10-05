"use client";
import AvatarWrapper from "@/ui-components/AvatarWrapper";
import {
  Avatar,
  Checkbox,
  Chip,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { User } from "next-auth";
import { useRouter } from "next/navigation";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import dayjs from "dayjs";
import SecurityIcon from "@mui/icons-material/Security";
import BuildIcon from "@mui/icons-material/Build";
import PersonIcon from "@mui/icons-material/Person";
import PublicIcon from "@mui/icons-material/Public";
import { store } from "@/store/store";

export default function UserListItem({ user }: { user: User }) {
  const { push } = useRouter();
  const { setSelectedUsers, selectedUsers } = store();
  const selected = selectedUsers.includes(user.id);
  const iconMap: { [key: string]: JSX.Element } = {
    SecurityIcon: <SecurityIcon />,
    BuildIcon: <BuildIcon />,
    PersonIcon: <PersonIcon />,
    PublicIcon: <PublicIcon />,
  };

  const handleSelectUser = (e: any) => {
    e.stopPropagation();
    if (selectedUsers.includes(user.id)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user.id]);
    }
  };

  return (
    <TableRow
      hover
      key={user.id}
      onClick={() => push(`/user/detail/${user.id}`)}
      sx={{ cursor: "pointer", opacity: user.active ? 1 : 0.2 }}
    >
      <TableCell>
        <Checkbox onClick={handleSelectUser} checked={selected} />
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
          onDelete={() => {}}
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
  );
}
