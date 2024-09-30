"use client"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import csLocale from "@fullcalendar/core/locales/cs"
import { Paper } from '@mui/material'

export default function FullcalendarWidget() {
  const data = []
  const eventObject = data.map((event:any)=>({id: event.id, title: event.name, start: event.from_date, end: event.to_date, allDay: true}))


  return (
    <Paper className="w-full h-full" style={{ minHeight: "420px" }}>
      <FullCalendar height="100%" locale={csLocale} plugins={[dayGridPlugin]} initialView="dayGridMonth" events={eventObject}/>
    </Paper>
  )
}
