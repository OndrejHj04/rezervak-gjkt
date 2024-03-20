import { Box, Button, Paper, Typography } from "@mui/material";
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
          <Button variant="contained" onClick={handleClick}>
            Pokračovat jako host
          </Button>
        </div>
      </Box>
    </Paper>
  );
}
