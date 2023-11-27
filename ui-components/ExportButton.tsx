"use client";
import { getExportData } from "@/app/admin/actions/actionts";
import handleExport from "@/lib/handleExport";
import { Button } from "@mui/material";
import Papa from "papaparse";

export default function ExportButton({ prop }: { prop: any }) {
  const makeExport = async () => {
    const data = await getExportData(prop);
    const blob = new Blob([Papa.unparse(data)], { type: "text/csv" });
    handleExport(blob, prop);
  };

  return (
    <Button variant="outlined" onClick={makeExport}>
      Export
    </Button>
  );
}
