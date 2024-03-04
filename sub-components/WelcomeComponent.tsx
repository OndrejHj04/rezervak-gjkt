import { Box, Paper, Typography } from "@mui/material";

export default function WelcomeComponent() {
  return (
    <Paper className="p-2 flex justify-center">
      <Box sx={{ maxWidth: 880, width: "100%" }}>
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          Vítejte na stránkách rezervačního systému chaty GJKT.
        </Typography>
        <Typography className="text-center">
          Pro používání aplikace je nutné se přihlásit.
        </Typography>
      </Box>
    </Paper>
  );
}
