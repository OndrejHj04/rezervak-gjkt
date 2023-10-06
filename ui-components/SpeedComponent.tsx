"use client";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AddUserModal from "@/sub-components/AddUserModal";
import { store } from "@/store/store";
import AddGroupModal from "@/sub-components/AddGroupModal";

const actions = [
  {
    icon: <PersonAddIcon />,
    name: "Přidat uživatele",
    string: "addUser",
  },
  {
    icon: <GroupAddIcon />,
    name: "Přidat skupinu",
    string: "addGroup",
  },
];

export default function SpeedComponent() {
  const { modal, setModal, user } = store();

  if (user?.role.role_id !== 1) return null;
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
      <AddUserModal />
      <AddGroupModal />
    </>
  );
}
