import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import SideMenuButton from "./SideMenuButton"
import Link from "next/link";
import TopBarUserCard from "./UserCardMenu";

export default async function TopBar() {
  const data = (await getServerSession(authOptions)) as any;

  return (
    <AppBar position="static" className="h-[52px]">
      <Toolbar className="!min-h-0 !p-0 !pl-2 flex my-auto">
        <div className="flex-1 flex justify-start items-center">
          <SideMenuButton user={data} />
          <Typography
            variant="h6"
            component={Link}
            href="/"
            className="text-inherit no-underline"
          >
            Chata GJKT
          </Typography>
        </div>
        <div className="flex flex-col">
        </div>
        <div className="flex-1 flex justify-end">
          <TopBarUserCard user={data?.user} />
        </div>
      </Toolbar>
    </AppBar>
  );
}
