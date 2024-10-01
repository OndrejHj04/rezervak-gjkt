"use client"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import csLocale from "@fullcalendar/core/locales/cs"
import { Paper, Button, ToggleButton, ButtonGroup, ToggleButtonGroup, Typography, Tooltip, Box, List, ListItem, ListItemText, Icon, ListItemIcon } from '@mui/material'
import { roomsEnum } from '@/app/constants/rooms'
import React, { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { NavigateBefore, NavigateNext } from "@mui/icons-material"
import { getFullName } from '@/app/constants/fullName'
import dayjs from 'dayjs'

export default function FullcalendarWidget({ searchParams, data }: { searchParams: any, data: any }) {
  const [roomsFilter, setRoomsFilter] = useState<number[]>(searchParams.rooms?.length ? searchParams?.rooms.split(",").map(Number) : [])

  const calendarEventData = data.data.map((event: any) => ({
    id: event.id,
    title: event.name,
    start: event.from_date,
    end: dayjs(event.to_date).add(1, "day").toDate(),
    allDay: true,
    rooms: event.rooms,
    leader: event.leader,
    color: event.status.color,
    icon: event.status.icon,
    display_name: event.status.display_name
  }))
  console.log(calendarEventData)
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
  const eventContentInjection = (event: any) => {
    const { leader, rooms, display_name, icon } = event.event.extendedProps

    return <Tooltip title={<List className='p-0'>
      <ListItem className="p-0">
        <ListItemText>Název: {event.event.title}</ListItemText>
      </ListItem>
      <ListItem className="p-0">
        <ListItemText>Pokoje: {rooms.map((item: any) => item.id).join(",")}</ListItemText>
      </ListItem>
      <ListItem className='p-0'>
        <ListItemText>Vedoucí: {getFullName(leader)}</ListItemText>
      </ListItem>
      <ListItem className="p-0">
        <ListItemText>Status: {display_name}</ListItemText>
        <ListItemIcon className='min-w-0 ml-2'>
          {<Icon sx={{ color: event.event.backgroundColor }}>{icon}</Icon>}    </ListItemIcon>      </ListItem>
      </List>}>
      <React.Fragment>
        <p>{event.event.title}</p>
      </React.Fragment>
    </Tooltip>
  }

  return (
    <Paper className="flex w-full h-full" style={{ minHeight: "420px" }}>
      <div className='flex flex-col gap-2 mx-2' style={{ width: "120px" }}>
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
        <Button variant="outlined" onClick={() => mutateCalendar("today")}>Dnes</Button>
        <ToggleButtonGroup orientation="vertical" onChange={handleRoomsFilterChange} value={roomsFilter}>
          <ToggleButton value="all" selected={roomsEnum.list.length === roomsFilter.length}>Celá chata</ToggleButton>
          {roomsEnum.list.map(rooms => (
            <ToggleButton value={rooms.id}>{rooms.label}</ToggleButton>
          ))}
        </ToggleButtonGroup>
      </div>
      <div className='flex-1'>
        <FullCalendar ref={calendarRef} height="100%" locale={csLocale} headerToolbar={{ right: "", left: "" }} plugins={[dayGridPlugin]} initialView="dayGridMonth" events={calendarEventData} eventContent={eventContentInjection} />
      </div>
    </Paper>
  )
}
