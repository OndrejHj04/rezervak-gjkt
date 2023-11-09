"use client";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import EditCalendar from "@mui/icons-material/EditCalendar";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AddUserModal from "@/app/navigation/modals/AddUserModal";
import { store } from "@/store/store";
import AddGroupModal from "@/app/navigation/modals/AddGroupModal";
import { useRouter } from "next/navigation";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ImportUsers from "./modals/ImportUsers";

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
  {
    icon: <EditCalendar />,
    name: "Vytvořit rezervaci",
    path: "/reservations/create",
  },
  {
    icon: <ReceiptLongIcon />,
    name: "Importovat uživatele",
    string: "importUsers",
  },
];

export default function SpeedComponent() {
  const { modal, setModal, user } = store();
  const { push } = useRouter();
  if (user?.role.id !== 1) return null;
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
            onClick={() => {
              if (action.string) setModal(action.string);
              else if (action.path) push(action.path);
            }}
          />
        ))}
      </SpeedDial>
      <AddUserModal />
      <AddGroupModal />
      <ImportUsers />
    </>
  );
}
