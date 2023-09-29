import { Paper, Typography } from "@mui/material";

export default function WelcomeComponent() {
  return (
    <Paper className="p-2">
      <Typography variant="h6" sx={{ textAlign: "center" }}>
        Pro používání aplikace je nutné se přihlásit
      </Typography>
      <Typography>
        Tato aplikace slouží k provádění rezervací objektu Školní chaty gymnázia
        GJKT.
      </Typography>
    </Paper>
  );
}
