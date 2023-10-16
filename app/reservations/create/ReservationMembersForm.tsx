import { Group } from "@/types";
import AvatarWrapper from "@/ui-components/AvatarWrapper";
import {
  Avatar,
  Checkbox,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { User } from "next-auth";

export default function ReservationMembersForm({
  groups,
  users,
}: {
  groups: Group[];
  users: User[];
}) {

  return (
    <Paper className="p-2">
      <Typography variant="h5">Účastníci: 0</Typography>
      <Typography variant="h6">Skupiny</Typography>
      <List>
        {groups.map((group) => (
          <ListItem key={group.id} disablePadding>
            <ListItemButton>
              <ListItemAvatar>
                <Avatar>{group.name[0]}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={group.name}
                secondary={`Počet členů: ${group.users.length}`}
              />
              <Checkbox />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Typography variant="h6">Uživatelé</Typography>
      <List>
        {users.map((user) => (
          <ListItem key={user.id} disablePadding>
            <ListItemButton>
              <ListItemAvatar>
                <AvatarWrapper data={user} />
              </ListItemAvatar>
              <ListItemText
                primary={`${user.first_name} ${user.last_name}`}
                secondary={user.email}
              />
              <Checkbox />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
