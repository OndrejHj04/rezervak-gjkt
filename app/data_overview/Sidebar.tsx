import {
  Divider,
  Typography,
} from "@mui/material";
import React from "react";
import FusionForm from "./sidebarComponents/FusionForm";

export default function Sidebar() {
  return (
    <div className="py-1">
      <Typography variant="h5" className="text-center">
        Nastavení
      </Typography>
      <Divider />
      <FusionForm />
    </div>
  );
}
