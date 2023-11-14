"use client";
import { groupsExport } from "@/app/admin/actions/actionts";
import handleExport from "@/lib/handleExport";
import { Button } from "@mui/material";
import Papa from "papaparse";

export default function ExportGroups() {
  const makeExport = async () => {
    const reservations = await groupsExport(status);
    const blob = new Blob([Papa.unparse(reservations)], { type: "text/csv" });
    handleExport(blob, "groups");
  };

  return (
    <Button variant="outlined" onClick={makeExport}>
      Export
    </Button>
  );
}
