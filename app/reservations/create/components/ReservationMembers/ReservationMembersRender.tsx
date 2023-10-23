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
import { useEffect, useState } from "react";
import { Group, GroupOwner } from "@/types";
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
  const [groupsIncluded, setGroupsIncluded] = useState<number[]>([]);
  const [members, setMembers] = useState<number[]>([]);

  const makeReset = () => {
    setMembers([]);
    setGroupsIncluded([]);
  };

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
          {groups.map((group) => {
            const isChecked = groupsIncluded.includes(group.id);
            const handleClick = () => {
              if (isChecked) {
                setGroupsIncluded((c) => c.filter((i) => i !== group.id));
                setMembers((c) =>
                  c.filter((i) => !group.users.includes(i as any))
                );
              } else {
                setGroupsIncluded((c) => [...c, group.id]);
                setMembers((c) => [
                  ...(new Set(c.concat(group.users as any)) as any),
                ]);
              }
            };
            return (
              <ListItemButton key={group.id} onClick={handleClick}>
                <Checkbox checked={isChecked} />
                <ListItemIcon>
                  <Avatar>{group.name[0].toUpperCase()}</Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={group.name}
                  secondary={group.owner.email}
                />
              </ListItemButton>
            );
          })}
        </List>
        <List subheader={<Typography variant="h6">Uživatelé</Typography>}>
          {users.map((user) => {
            const isChecked = members.includes(user.id);
            const handleClick = () => {
              if (isChecked) {
                setMembers((c) => c.filter((i) => i !== user.id));
              } else {
                setMembers((c) => [...c, user.id]);
              }
            };
            return (
              <ListItemButton key={user.id} onClick={handleClick}>
                <Checkbox checked={isChecked} />
                <ListItemIcon>
                  <AvatarWrapper data={user} />
                </ListItemIcon>
                <ListItemText
                  primary={`${user.first_name} ${user.last_name}`}
                  secondary={user.email}
                />
              </ListItemButton>
            );
          })}
        </List>
        <div className="flex flex-col gap-2">
          <Button variant="outlined">Uložit</Button>
          <Button
            variant="contained"
            color="error"
            disabled={!groupsIncluded.length && !members.length}
            onClick={makeReset}
          >
            Smazat
          </Button>
        </div>
      </AccordionDetails>
    </Accordion>
  );
}
