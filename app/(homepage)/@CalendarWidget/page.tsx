"use client"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import csLocale from "@fullcalendar/core/locales/cs"
import { Paper, Button, ToggleButton, ButtonGroup, ToggleButtonGroup, Typography } from '@mui/material'
import { roomsEnum } from '@/app/constants/rooms'
import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { NavigateBefore, NavigateNext } from "@mui/icons-material"

export default function FullcalendarWidget({ searchParams }: { searchParams: any }) {
  const data = []
  const [roomsFilter, setRoomsFilter] = useState<number[]>(searchParams.rooms.length ? searchParams.rooms.split(",").map(Number) : [])

  const calendarRef = useRef(null)
  const pathname = usePathname();
  const { replace } = useRouter()
  const [calendarTitle, setCalendarTitle] = useState("")

  const handleRoomsFilterChange = (_: any, values: any[]) => {
    if (values.includes("all")) {
      setRoomsFilter(r => r.length === roomsEnum.list.length ? [] : roomsEnum.list.map(room => room.id))
    } else
      setRoomsFilter(values)
  }

  useEffect(() => {
    const params = new URLSearchParams(searchParams)
    params.set("rooms", roomsFilter.toString())
    replace(`${pathname}?${params.toString()}`);
  }, [roomsFilter])

  useEffect(() => {
    const calendarApi = (calendarRef.current as any).getApi()
    setCalendarTitle(calendarApi.currentData.viewTitle)
  }, [])

  const mutateCalendar = (action: "next" | "prev" | "today") => {
    const calendarApi = (calendarRef.current as any).getApi()
    switch (action) {
      case "next":
        calendarApi.next()
        break
      case "prev":
        calendarApi.prev()
        break;
      case "today":
        calendarApi.today()
    }
    setCalendarTitle(calendarApi.currentData.viewTitle)
  }



  return (
    <Paper className="flex w-full h-full" style={{ minHeight: "420px" }}>
      <div className='flex flex-col gap-2 mx-2' style={{width: "120px"}}>
        <Typography variant="h6" className='font-semibold text-center'>
          {calendarTitle}
        </Typography>
        <ButtonGroup fullWidth>
          <Button onClick={() => mutateCalendar("prev")}>
            <NavigateBefore />
          </Button>
          <Button onClick={() => mutateCalendar("next")}>
            <NavigateNext />
          </Button>
        </ButtonGroup>
      <Button variant="outlined" onClick={()=>mutateCalendar("today")}>Dnes</Button>
        <ToggleButtonGroup orientation="vertical" onChange={handleRoomsFilterChange} value={roomsFilter}>
          <ToggleButton value="all" selected={roomsEnum.list.length === roomsFilter.length}>Celá chata</ToggleButton>
          {roomsEnum.list.map(rooms => (
            <ToggleButton value={rooms.id}>{rooms.label}</ToggleButton>
          ))}
        </ToggleButtonGroup>
      </div>
      <div className='flex-1'>
        <FullCalendar ref={calendarRef} height="100%" locale={csLocale} headerToolbar={{ right: "", left: "" }} plugins={[dayGridPlugin]} initialView="dayGridMonth" events={[]} />
      </div>
    </Paper>
  )
}
