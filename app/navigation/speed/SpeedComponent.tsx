import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import EditCalendar from "@mui/icons-material/EditCalendar";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AddUserModal from "@/app/navigation/speed/modals/AddUserModal";
import { store } from "@/store/store";
import AddGroupModal from "@/app/navigation/speed/modals/AddGroupModal";
import { useRouter } from "next/navigation";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ImportUsers from "./modals/ImportUsers";
import Link from "next/link";
import { Icon } from "@mui/material";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

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

export default async function SpeedComponent() {
  const { user } = (await getServerSession(authOptions)) as any;
  console.log(user.role.id);

  if (user.role.id !== 1) return null;
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
            icon={
              <Link
                href="/navigation/speed/modal"
                className="flex justify-center items-center w-full h-full"
              >
                <Icon color="action">{action.icon}</Icon>
              </Link>
            }
            tooltipTitle={action.name}
          />
        ))}
      </SpeedDial>
    </>
  );
}
