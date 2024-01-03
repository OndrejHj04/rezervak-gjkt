import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getRoutes, rolesConfig } from "@/rolesConfig";
import { Icon } from "@mui/material";

export default async function SpeedComponent() {
  const data = (await getServerSession(authOptions)) as any;
  const menu = getRoutes(Object.values(rolesConfig), data?.user.role).filter(
    (item: any) => item.menu[1]
  );
  return (
    <>
      {!!menu.length && (
        <SpeedDial
          ariaLabel="IsShowSpeed dial"
          sx={{ position: "absolute", bottom: 16, right: 16 }}
          icon={<SpeedDialIcon />}
        >
          {menu.map((action: any) => {
            return (
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
            );
          })}
        </SpeedDial>
      )}
    </>
  );
}
