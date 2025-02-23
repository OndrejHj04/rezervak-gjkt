import SearchBar from "@/ui-components/SearchBar"
import { Paper } from "@mui/material"
import React from "react"
import RolesSelect from "./components/RolesSelect"
import OrganizationSelect from "./components/OrganizationSelect"
import ExportButton from "@/ui-components/ExportButton"
import VerifiedSelect from "./components/VerifiedSelect"

export default function UserListLayout({ children }: { children: React.ReactNode }) {

  return (
    <React.Fragment>
      <div className="flex">
        <div className="flex-1 md:flex hidden" />
        <SearchBar variant="standard" className="md:w-80 w-32" label="Hledat uživatele" />
        <div className="flex-1 flex justify-end gap-2 items-center">
          <VerifiedSelect />
          <RolesSelect />
          <OrganizationSelect />
          <ExportButton prop="users" translate="Uživatelé" size="small" />
        </div>
      </div>
      <Paper>
        {children}
      </Paper>
    </React.Fragment>
  )
}
