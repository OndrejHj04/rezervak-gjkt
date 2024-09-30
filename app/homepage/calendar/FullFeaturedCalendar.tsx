"use client"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import csLocale from "@fullcalendar/core/locales/cs"

export default function FullcalendarWidget({ data }: { data: any }) {
  const eventObject = data.map((event:any)=>({id: event.id, title: event.name, start: event.from_date, end: event.to_date, allDay: true}))

  console.log(data, eventObject)

  return (
    <div className="w-full h-full" style={{ minHeight: "420px" }}>
      <FullCalendar height="100%" locale={csLocale} plugins={[dayGridPlugin]} initialView="dayGridMonth" events={eventObject}/>
    </div>
  )
}
