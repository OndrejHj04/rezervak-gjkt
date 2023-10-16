"use client";
import { Group } from "@/types";
import { User } from "next-auth";
import {
  Button,
  IconButton,
  Pagination,
  PaginationItem,
  Paper,
  Typography,
} from "@mui/material";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import ChairIcon from "@mui/icons-material/Chair";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { useState } from "react";
export default function CreateReservationWrapper({
  groups,
  users,
}: {
  groups: Group[];
  users: User[];
}) {
  const icons = [
    <CalendarMonthIcon key={1} />,
    <EmojiPeopleIcon key={2} />,
    <ChairIcon key={3} />,
    <LeaderboardIcon key={4} />,
  ];
  const [navigate, setNavigate] = useState(0);
  return (
    <Paper className="p-2 w-full max-w-2xl mx-auto flex flex-col items-center">
      <div className="flex flex-1"></div>
      <Pagination
        count={4}
        renderItem={(item: any) => {
          if (item.type === "page") {
            return (
              <IconButton onClick={() => setNavigate(item.page - 1)}>
                {navigate >= item.page ? (
                  <DoneAllIcon color="success" />
                ) : (
                  <>{icons[item.page - 1]}</>
                )}
              </IconButton>
            );
          }
        }}
      />
    </Paper>
  );
}
