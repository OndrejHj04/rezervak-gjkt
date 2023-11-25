"use client";
import { Button } from "@mui/material";
import { useSearchParams } from "next/navigation";
import Papa from "papaparse";
import handleExport from "@/lib/handleExport";
import { reservationsExport } from "@/app/admin/actions/actionts";

export default function ReservationsExport({
  reservations,
}: {
  reservations: number;
}) {
  const searchParams = useSearchParams();
  const status = Number(searchParams.get("status")) || 0;

  const makeExport = async () => {
    const reservations = await reservationsExport(status);
    const blob = new Blob([Papa.unparse(reservations)], { type: "text/csv" });
    handleExport(blob, "reservations");
  };

  return (
    <Button variant="outlined" onClick={makeExport} disabled={!reservations}>
      Export
    </Button>
  );
}
