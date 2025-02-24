"use client";

import { TextField } from "@mui/material";
import { DateField, DatePicker } from "@mui/x-date-pickers";

export default function ReservationDateFilter({
  className,
}: {
  className?: any;
}) {
  return (
    <div className="flex gap-2">
      <DateField size="small" />
    </div>
  );
}
