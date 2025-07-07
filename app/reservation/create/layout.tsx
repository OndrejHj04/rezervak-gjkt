"use client";
import { Typography } from "@mui/material";
import React, { createContext, useState } from "react";
import CreateButton from "./CreateButton";

interface ReservationContextType {
  createReservation: any;
  setCreateReservation: (createReservation: any) => void;
}

const ReservationContext = createContext<ReservationContextType | null>(null);

export default function CreateReservationLayout({ children }: { children: React.ReactNode }) {
  const [createReservation, setCreateReservation] = useState({
    from_date: "",
    to_date: "",
    groups: [],
    rooms: [],
    leader: 0,
    purpouse: "",
    instructions: "",
    name: "",
    family: false,
  });

  return (
    <ReservationContext value={{ createReservation, setCreateReservation }}>
      <div className="flex flex-col">
        <div className="flex justify-between mb-2 items-center">
          <Typography variant="h5">Nová rezervace</Typography>
          <CreateButton />
        </div>
        {children}
      </div>
    </ReservationContext>
  )
}

export { ReservationContext }
