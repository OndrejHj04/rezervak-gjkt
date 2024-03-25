"use client";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Button,
  Checkbox,
  InputAdornment,
  List,
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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import TableListCheckbox from "@/ui-components/TableListCheckbox";
import TableListPagination from "@/ui-components/TableListPagination";

export default function ReservationMembersRender({
  groups,
  users,
}: {
  groups: any;
  users: any;
}) {
  const { setCreateReservation, createReservation } = store();
  const [expanded, setExpanded] = useState(false);
  const isValid = createReservation.members.length;
  const [groupsIncluded, setGroupsIncluded] = useState<number[]>([]);
  const [members, setMembers] = useState<number[]>([]);
  const searchParams = useSearchParams();
  const searchUsers = searchParams.get("users");
  const searchGroups = searchParams.get("groups");
  const pathname = usePathname();
  const { replace } = useRouter();

  const makeReset = () => {
    setMembers([]);
    setGroupsIncluded([]);
    setCreateReservation({
      ...createReservation,
      members: [],
      groups: [],
    });
  };

  const handleSubmit = () => {
    setCreateReservation({
      ...createReservation,
      members,
      groups: groupsIncluded,
    });
    setExpanded(false);
  };

  const changeSearchFilter = (value: any, prop: any) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(prop, value);
    else params.delete(prop);
    replace(`${pathname}?${params.toString()}`);
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
      <AccordionDetails className="flex gap-2 md:p-4 p-1 md:flex-row flex-col overflow-auto">
        <List
          subheader={
            <div className="flex items-center gap-2">
              <Typography variant="h6">Skupiny</Typography>
              <TextField
                sx={{ width: 200 }}
                defaultValue={searchGroups}
                onChange={(e) => changeSearchFilter(e.target.value, "groups")}
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
          <div>
            <PerfectScrollbar>
              {groups.data.map((group: any) => {
                const isChecked = groupsIncluded.includes(group.id);
                const handleClick = () => {
                  if (isChecked) {
                    setGroupsIncluded((c) => c.filter((i) => i !== group.id));
                    setMembers((c) =>
                      c.filter((i) => !group.users.includes(i as any))
                    );
                  } else {
                    setGroupsIncluded((c) => [...c, group.id]);
                    setMembers((c) => [...(new Set(group.users) as any)]);
                  }
                };
                return (
                  <ListItemButton
                    key={group.id}
                    onClick={handleClick}
                    className="md:py-2 md:px-4 py-0.5 px-1"
                  >
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
            <TableListPagination
              count={groups.count || 0}
              name="gpage"
              rpp={5}
            />
          </div>
        </List>
        <List
          subheader={
            <div className="flex items-center gap-2">
              <Typography variant="h6">Uživatelé</Typography>
              <TextField
                sx={{ width: 200 }}
                defaultValue={searchUsers}
                onChange={(e) => changeSearchFilter(e.target.value, "users")}
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
          <div>
            <PerfectScrollbar>
              {users.data.map((user: any) => {
                const isChecked = members.includes(user.id);
                const handleClick = () => {
                  if (isChecked) {
                    setMembers((c) => c.filter((i) => i !== user.id));
                  } else {
                    setMembers((c) => [...c, user.id]);
                  }
                };
                return (
                  <ListItemButton
                    key={user.id}
                    onClick={handleClick}
                    className="md:py-2 md:px-4 py-0.5 px-1"
                  >
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
            <TableListPagination
              count={users.count || 0}
              name="upage"
              rpp={5}
            />
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
