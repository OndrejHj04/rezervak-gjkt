import ExportButton from "@/ui-components/ExportButton";
import SearchBar from "@/ui-components/SearchBar";
import { Paper } from "@mui/material";
import React from "react";

export default function GroupListLayout({ children }: { children: any }) {

  return (
    <React.Fragment>
      <div className="flex">
        <div className="flex-1 md:flex hidden" />
        <SearchBar variant="standard" label="Hledat skuipiny" className="md:w-80 w-40" />
        <div className="flex-1 flex justify-end items-center">
          <ExportButton prop="group" translate="Skupiny" size="small" />
        </div>
      </div>
      <Paper>
        {children}
      </Paper>
    </React.Fragment>
  )
}
