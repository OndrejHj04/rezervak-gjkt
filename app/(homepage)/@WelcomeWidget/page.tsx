import { Paper, Typography } from "@mui/material"

export default async function WelcomeWidget() {

  return (
    <Paper className="mb-2 p-2 flex gap-2 justify-between">
      <Typography variant="h5">
        Dobrý den, Ondřeji!
      </Typography>
    </Paper>
  )
}
