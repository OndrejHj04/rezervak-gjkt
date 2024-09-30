"use client"
import { Rooms, roomsEnum } from "@/app/constants/rooms"
import FullCalendar from "@fullcalendar/react";
import { Paper, ButtonGroup, Button, ToggleButtonGroup, ToggleButton } from "@mui/material"
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import FullFeaturedCalendar from "./FullFeaturedCalendar"

type RoomsFilter = Rooms | "all"

export default function Calendar() {
  return (
    <Paper className="flex p-2 flex-1 flex-col">
      <FullFeaturedCalendar data={[]}/>
    </Paper>
  )
}
