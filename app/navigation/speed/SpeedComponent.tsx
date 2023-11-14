import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import EditCalendar from "@mui/icons-material/EditCalendar";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import Link from "next/link";
import { Icon } from "@mui/material";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

const actions = [
  {
    icon: <PersonAddIcon />,
    name: "Přidat uživatele",
    path: "/admin/users/new",
  },
  {
    icon: <GroupAddIcon />,
    name: "Přidat skupinu",
    path: "/admin/groups/new",
  },
  {
    icon: <EditCalendar />,
    name: "Vytvořit rezervaci",
    path: "/reservations/create",
  },
  {
    icon: <ReceiptLongIcon />,
    name: "Importovat uživatele",
    path: "/admin/users/import",
  },
];

export default async function SpeedComponent() {
  const data = (await getServerSession(authOptions)) as any;

  if (data?.user.role.id !== 1) return null;
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
                href={action.path}
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
