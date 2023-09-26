"use client";
import * as React from "react";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import { usePathname } from "next/navigation";

const actions = [
  {
    icon: <GroupAddIcon />,
    name: "Přidat uživatele",
    action: () => console.log("copy"),
  },
];

export default function SpeedComponent() {
  const path = usePathname();

  return (
    <SpeedDial
      ariaLabel="IsShowSpeed dial"
      sx={{ position: "absolute", bottom: 16, right: 16 }}
      icon={<SpeedDialIcon />}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          onClick={action.action}
        />
      ))}
    </SpeedDial>
  );
}
