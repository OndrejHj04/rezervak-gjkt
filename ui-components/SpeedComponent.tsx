"use client";
import { useState } from "react";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import { usePathname } from "next/navigation";
import AddUserModal from "@/sub-components/AddUserModal";
import { store } from "@/store/store";

const actions = [
  {
    icon: <GroupAddIcon />,
    name: "Přidat uživatele",
    string: "addUser",
  },
];

export default function SpeedComponent() {
  const path = usePathname();
  const { modal, setModal } = store();
  console.log(modal);
  return (
    <>
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
            onClick={() => setModal(action.string)}
          />
        ))}
      </SpeedDial>
      {modal === "addUser" && <AddUserModal setModal={setModal} />}
    </>
  );
}
