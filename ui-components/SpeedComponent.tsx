"use client";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
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
  const { modal, setModal } = store();

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
            onClick={() => setModal(true)}
          />
        ))}
      </SpeedDial>
      <AddUserModal />
    </>
  );
}
