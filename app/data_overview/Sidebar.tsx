import { Divider, Typography } from "@mui/material";
import React from "react";
import FusionForm from "./sidebarComponents/FusionForm";
import { ResetFiltersButton } from "./sidebarComponents/ResetFiltersButton";

export default function Sidebar() {
  return (
    <div className="h-full flex flex-col">
      <Typography variant="h5" className="text-center">
        Nastavení
      </Typography>
      <Divider />
      <FusionForm />

      <ResetFiltersButton className="mt-auto"/>
    </div>
  );
}
