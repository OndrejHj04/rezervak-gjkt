"use client";

import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useState } from "react";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ListIcon from "@mui/icons-material/List";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function ReservationsSwitch() {
  const searchParams = useSearchParams();
  const value = searchParams.get("mode") || "list";
  const { replace } = useRouter();
  const pathname = usePathname();

  const handleEdit = (_: any, val: any) => {
    if (val) {
      const params = new URLSearchParams(searchParams);
      params.set("mode", val);
      replace(`${pathname}?${params.toString()}`);
    }
  };
  
  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={handleEdit}
      aria-label="text alignment"
    >
      <ToggleButton value="calendar" aria-label="left aligned">
        <CalendarMonthIcon />
      </ToggleButton>
      <ToggleButton value="list" aria-label="left aligned">
        <ListIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
