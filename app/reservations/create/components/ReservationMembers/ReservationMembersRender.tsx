"use client";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Button,
  Checkbox,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import { Group } from "@/types";
import { User } from "next-auth";
import AvatarWrapper from "@/ui-components/AvatarWrapper";

export default function ReservationMembersRender({
  groups,
  users,
}: {
  groups: Group[];
  users: User[];
}) {
  const [expanded, setExpanded] = useState(true);
  const isValid = true;
  const [groupMembers, setGroupsMembers] = useState([]);
  const [members, setMembers] = useState([]);
  return (
    <Accordion expanded={expanded}>
      <AccordionSummary
        onClick={() => setExpanded((c) => !c)}
        expandIcon={
          isValid && !expanded ? (
            <CheckCircleIcon color="success" />
          ) : (
            <ExpandMoreIcon />
          )
        }
      >
        <div className="flex gap-5 items-center">
          <Typography variant="h6">Účastníci rezervace</Typography>
          <Typography>15 účastníků</Typography>
        </div>
      </AccordionSummary>
      <AccordionDetails className="flex">
        <List subheader={<Typography variant="h6">Skupiny</Typography>}>
          {groups.map((group) => (
            <ListItemButton key={group.id}>
              <Checkbox />
              <ListItemIcon>
                <Avatar>{group.name[0]}</Avatar>
              </ListItemIcon>
              <ListItemText
                primary={group.name}
                secondary={group.owner.email}
              />
            </ListItemButton>
          ))}
        </List>
        <List subheader={<Typography variant="h6">Uživatelé</Typography>}>
          {users.map((user) => (
            <ListItemButton key={user.id}>
              <Checkbox />
              <ListItemIcon>
                <AvatarWrapper data={user} />
              </ListItemIcon>
              <ListItemText
                primary={`${user.first_name} ${user.last_name}`}
                secondary={user.email}
              />
            </ListItemButton>
          ))}
        </List>
        <div className="flex flex-col gap-2">
          <Button variant="outlined">Uložit</Button>
          <Button variant="contained" color="error">
            Smazat
          </Button>
        </div>
      </AccordionDetails>
    </Accordion>
  );
}
