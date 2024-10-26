import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { getUserTheme } from "@/lib/api";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import DarkModeToggle from "./DarkModeToggle";
import SideMenuButton from "./SideMenuButton"
import Link from "next/link";
import TopBarUserCard from "./UserCardMenu";
import { Button } from "@mui/material";

export default async function TopBar() {
  const data = (await getServerSession(authOptions)) as any;
  const { theme } = await getUserTheme();

  return (
    <AppBar position="static" className="h-[52px]">
      <Toolbar className="!min-h-0 !p-0 !pl-2 flex my-auto">
        <div className="flex-1 flex justify-start items-center">
          <SideMenuButton />
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
          {data ? <TopBarUserCard user={data.user} /> : <Button component={Link} href="/login" style={{ color: "white" }}>Přihlásit se</Button>}
        </div>
      </Toolbar>
    </AppBar>
  );
}
