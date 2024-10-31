import { Typography } from "@mui/material";
import React from "react";
import CreateButton from "./CreateButton";

export default function CreateReservationLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className="flex flex-col">
      <div className="flex justify-between mb-2 items-center">
        <Typography variant="h5">Nová rezervace</Typography>
        <CreateButton />
      </div>
      {children}
    </div>
  )
}
