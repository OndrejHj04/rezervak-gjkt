import { getServerSession } from "next-auth";
import { getProviders, signIn, useSession } from "next-auth/react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { Sign } from "crypto";
import SigninButton from "@/components/SigninButton";
import HandleMenu from "./HandleMenu";

export default function Navbar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>

            <HandleMenu />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Rezervační systém
          </Typography>
          <SigninButton />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
