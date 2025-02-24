import { Button, Paper, Tab, Tabs } from "@mui/material";
import React from "react";
import SearchBar from "@/ui-components/SearchBar";
import StatusSelect from "../list/components/StatusSelect";
import ExportButton from "@/ui-components/ExportButton";
import RegistrationState from "./components/RegistrationState";
import ReservationDateFilter from "./components/ReservationDateFilter";

export default function ReservationListLayout({ children }: { children: React.ReactNode }) {

  return (
    <React.Fragment>
      <div className="flex">
        <div className="flex-1 md:flex hidden" />
        <SearchBar variant="standard" className="md:w-80 w-40" label="Hledat rezervace" />
        <div className="flex-1 flex items-center gap-2 justify-end">
          <ReservationDateFilter />
          <RegistrationState />
          <StatusSelect />
          <ExportButton translate="Rezervace" prop="reservations" size="small" />
        </div>
      </div>
      <Paper>
        {children}
      </Paper>
    </React.Fragment >
  )
}
