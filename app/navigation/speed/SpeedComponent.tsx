import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import Link from "next/link";
import { Icon } from "@mui/material";

const menu = [
  { href: "/reservation/create", name: "Vytvořit rezervaci", icon: "edit_calendar" },
  { href: "/group/create", name: "Vytvořit skupinu", icon: "group_add" },
  { href: "/user/import", name: "Importovat uživatele", icon: "import_export" },
  { href: "/user/create", name: "Vytvořit uživatele", icon: "person_add" },
]

export default async function SpeedComponent() {

  return (
    <>
      {!!menu.length && (
        <SpeedDial
          ariaLabel="IShowSpeed dial"
          sx={{ position: "absolute", bottom: 16, right: 16 }}
          icon={<SpeedDialIcon />}
        >
          {menu.map((action: any) => {
            return (
              <SpeedDialAction
                key={action.name}
                icon={
                  <Link
                    href={action.href}
                    className="flex justify-center items-center w-full h-full"
                  >
                    <Icon color="action">{action.icon}</Icon>
                  </Link>
                }
                tooltipTitle={action.name}
              />
            );
          })}
        </SpeedDial>
      )}
    </>
  );
}
