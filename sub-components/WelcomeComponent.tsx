"use client"
import { Tooltip, Box, Button, Paper, Typography } from "@mui/material";
import { signIn } from "next-auth/react";

export default function WelcomeComponent() {
  const handleClick = () => {
    signIn("credentials", {
      email: "host@nemazat.cz",
      password: "host",
    });
  };

  return (
    <Paper className="p-2 flex justify-center">
      <Box sx={{ maxWidth: 880, width: "100%" }}>
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          Vítejte na stránkách rezervačního systému chaty GJKT.
        </Typography>
        <Typography className="text-center">
          Pro používání aplikace je nutné se přihlásit.
        </Typography>
        <div className="flex justify-center mt-2">
          <Tooltip title={<Typography variant="subtitle1" className="text-center">
            Z důvodu probíhajících releasů aplikace je tato možnost dočasně vypnuta.
          </Typography>}>
            <div>
              <Button disabled variant="contained" onClick={handleClick}>
                Pokračovat bez přihlášení
              </Button>
            </div>
          </Tooltip>
        </div>
      </Box>
    </Paper>
  );
}
