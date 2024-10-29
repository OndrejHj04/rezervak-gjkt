import AvatarWrapper from "@/ui-components/AvatarWrapper";
import { CardHeader, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";

export default function GroupDetailDisplay({ groupDetail }: { groupDetail: any }) {

  return (
    <List>
      <ListItem disablePadding>
        <ListItemText>Název: {groupDetail.name}</ListItemText>
      </ListItem>
      <ListItem disablePadding>
        <ListItemText>Popis: {groupDetail.description}</ListItemText>
      </ListItem>
      <ListItem disablePadding className="w-fit gap-2">
        <ListItemText>Vedoucí rezervace: </ListItemText>
        <AvatarWrapper data={{ image: groupDetail.owner_image }} size={40} />
        <ListItemText primary={groupDetail.owner_name} secondary={groupDetail.owner_email}></ListItemText>
      </ListItem>
    </List >
  )
}
