import AvatarWrapper from "@/ui-components/AvatarWrapper";
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

export default function UserCard(props: any) {
  const { user, ...other } = props;
  return (
    <ListItem disablePadding {...other}>
      <ListItemIcon>
        <AvatarWrapper data={user} />
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography>
            {user.first_name} {user.last_name}
          </Typography>
        }
        secondary={user.email}
      />
    </ListItem>
  );
}
