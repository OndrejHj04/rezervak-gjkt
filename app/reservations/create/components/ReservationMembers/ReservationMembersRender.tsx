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
  return (
    <div>
      
    </div>
  )
}
