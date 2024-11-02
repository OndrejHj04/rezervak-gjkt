import { Paper, Typography } from "@mui/material";
import React from "react";

export default function Layout({ children }: { children: any }) {

  return (
    <React.Fragment>
      <Typography variant="h5">Vytvořit účet člena rodiny</Typography>
      <Typography>Vytvořte účet pro člena rodiny, který budete zde v aplikaci moci ovládat.</Typography>
      <Paper className="p-2 mt-2">
        {children}
      </Paper>
    </React.Fragment>
  )
}
