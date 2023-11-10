"use client";
import { Button } from "@mui/material";
import { useSearchParams } from "next/navigation";

import handleExport from "@/app/utils/export/handleExport";
import { toast } from "react-toastify";

export default function ReservationsExport({
  reservations,
}: {
  reservations: number;
}) {
  const searchParams = useSearchParams();
  const status = Number(searchParams.get("status")) || 0;

  const makeExport = () => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/reservations/export?status=${status}`
    )
      .then((response) => response.blob())
      .then((blob) => {
        handleExport(blob, "reservations");
        toast.success("Rezervace byly exportovány");
      })
      .catch((e) => toast.error("Něco se nepovedlo"));
  };

  return (
    <Button variant="outlined" onClick={makeExport} disabled={!reservations}>
      Export
    </Button>
  );
}
