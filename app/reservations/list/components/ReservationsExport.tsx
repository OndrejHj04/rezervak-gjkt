"use client";
import { Button } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Papa from "papaparse";
import handleExport from "@/app/utils/export/handleExport";
import { toast } from "react-toastify";

export default function ReservationsExport() {
  const searchParams = useSearchParams();
  const status = Number(searchParams.get("status")) || 0;

  const makeExport = () => {
    fetch(`http://localhost:3000/api/reservations/export?status=${status}`)
      .then((response) => response.blob())
      .then((blob) => {
        handleExport(blob, "reservations");
        toast.success("Rezervace byly exportovány");
      })
      .catch((e) => toast.error("Něco se nepovedlo"));
  };

  return (
    <Button variant="outlined" onClick={makeExport}>
      Export
    </Button>
  );
}
