"use client";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Button,
  Checkbox,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect, useState } from "react";
import { Group, GroupOwner } from "@/types";
import { User } from "next-auth";
import AvatarWrapper from "@/ui-components/AvatarWrapper";
import { store } from "@/store/store";
import SearchIcon from "@mui/icons-material/Search";
import PerfectScrollbar from "react-perfect-scrollbar";

export default function ReservationMembersRender({
  groups,
  users,
}: {
  groups: Group[];
  users: User[];
}) {
  const { setCreateReservation, createReservation } = store();
  const [expanded, setExpanded] = useState(false);
  const isValid = createReservation.members.length;
  const [groupsIncluded, setGroupsIncluded] = useState<number[]>([]);
  const [members, setMembers] = useState<number[]>([]);
  const [groupsFilter, setGroupsFilter] = useState<Group[]>(groups);
  const [groupsSearch, setGroupsSearch] = useState("");

  const [usersFilter, setUsersFilter] = useState<User[]>(users);
  const [usersSearch, setUsersSearch] = useState("");

  const makeReset = () => {
    setMembers([]);
    setGroupsIncluded([]);
    setCreateReservation({ ...createReservation, members: [], groups: [] });
  };

  useEffect(() => {
    if (!usersSearch) {
      setUsersFilter(users);
    } else {
      setUsersFilter(
        users.filter((user: any) =>
          user.full_name.toLowerCase().includes(usersSearch.toLowerCase())
        )
      );
    }
  }, [usersSearch]);

  useEffect(() => {
    if (!groupsSearch) {
      setGroupsFilter(groups);
    } else {
      setGroupsFilter(
        groups.filter((group) =>
          group.name.toLowerCase().includes(groupsSearch.toLowerCase())
        )
      );
    }
  }, [groupsSearch]);

  const handleSubmit = () => {
    setCreateReservation({
      ...createReservation,
      members,
      groups: groupsIncluded,
    });
    setExpanded(false);
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
          {!!createReservation.members.length && (
            <Typography>
              {createReservation.members.length} Účastníků
            </Typography>
          )}
        </div>
      </AccordionSummary>
      <AccordionDetails className="flex gap-2">
        <List
          sx={{ width: 320 }}
          subheader={
            <div className="flex items-center gap-2">
              <Typography variant="h6">Skupiny</Typography>
              <TextField
                value={groupsSearch}
                onChange={(e) => setGroupsSearch(e.target.value)}
                sx={{ width: 200 }}
                size="small"
                label="Hledat skupinu..."
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          }
        >
          <div style={{ height: 250 }}>
            <PerfectScrollbar>
              {groupsFilter?.map((group) => {
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
            </PerfectScrollbar>
          </div>
        </List>
        <List
          sx={{ width: 320 }}
          subheader={
            <div className="flex items-center gap-2">
              <Typography variant="h6">Uživatelé</Typography>
              <TextField
                value={usersSearch}
                onChange={(e) => setUsersSearch(e.target.value)}
                sx={{ width: 200 }}
                size="small"
                label="Hledat uživatele..."
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          }
        >
          <div style={{ height: 250 }}>
            <PerfectScrollbar>
              {usersFilter.map((user) => {
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
            </PerfectScrollbar>
          </div>
        </List>
        <div className="flex flex-col gap-2">
          <Button
            variant="contained"
            disabled={!groupsIncluded.length && !members.length}
            onClick={handleSubmit}
          >
            Uložit
          </Button>
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
