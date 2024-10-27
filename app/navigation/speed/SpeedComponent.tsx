import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import Link from "next/link";
import { Icon } from "@mui/material";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { actionMenu } from "@/lib/rolesConfig";

export default async function SpeedComponent() {
  const user = await getServerSession(authOptions) as any

  if (!user) {
    return null
  }

  return (
    <SpeedDial
      ariaLabel="IShowSpeed dial"
      sx={{ position: "absolute", bottom: 16, right: 16 }}
      icon={<SpeedDialIcon />}
    >
      {actionMenu.map((action: any) => {
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
  );
}
