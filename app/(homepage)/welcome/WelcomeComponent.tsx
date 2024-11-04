import { Button, Divider, Paper, Typography } from "@mui/material";
import React from "react";
import LoginForm from "./LoginForm";
import ResetPassword from "./ResetPassword";

export default function WelcomeComponent() {

  return (
    <div className="flex flex-col gap-2">
      <Paper className="w-full p-2">
        <Typography variant="h5">Vítejte na stránkách rezervačního systému Chata GJKT.</Typography>
      </Paper>
      <div className="flex gap-2 md:flex-row flex-col">
        <LoginForm />
        <Paper className="p-2 flex flex-col">
          <Typography variant="h6" className="text-center">Nebo pokračujte v režimu hosta</Typography>
          <Divider flexItem />
          <div className="flex-1">
            <Typography className="w-0 text-justify text-sm" color="text.secondary" style={{ minWidth: "100%" }}>Režim hosta slouží pouze na prohlížení aplikace s testovacími daty a vytvořené požadavky nebo rezervace nebudou uloženy.</Typography>
          </div>
          <Button disabled={true} variant="contained">Pokračovat jako host</Button>
        </Paper>
        <ResetPassword />
      </div>
    </div>
  )
}
