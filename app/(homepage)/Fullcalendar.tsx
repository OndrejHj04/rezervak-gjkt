"use client"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import csLocale from "@fullcalendar/core/locales/cs"
import { Paper, Button, ToggleButton, ButtonGroup, ToggleButtonGroup, Typography, Tooltip, List, ListItem, ListItemText, Icon, ListItemIcon } from '@mui/material'
import { roomsEnum } from '@/app/constants/rooms'
import React, { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { NavigateBefore, NavigateNext } from "@mui/icons-material"
import { getFullName } from '@/app/constants/fullName'

import dayjs from 'dayjs'
import { setBlockedDates } from '@/lib/api'

export default function FullcalendarComponent({ searchParams, data, role }: { searchParams: any, data: any, role: any }) {
  const [roomsFilter, setRoomsFilter] = useState<number[]>(searchParams.rooms?.length ? searchParams?.rooms.split(",").map(Number) : [])
  const [selectedDays, setSelectedDays] = useState<any>([])

  const calendarEventData = data.data.map((event: any) => ({
    id: event.id,
    title: event.name,
    start: event.from_date,
    end: dayjs(event.to_date).add(1, "day").format("YYYY-MM-DD"),
    rooms: event.rooms,
    leader: event.leader,
    color: event.status.color,
    icon: event.status.icon,
    display_name: event.status.display_name,
    ...(event.status.id !== 5 && { url: `/reservation/detail/${event.id}/info` })
  }))

  const calendarRef = useRef(null)
  const pathname = usePathname();
  const { replace, refresh } = useRouter()
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
      <ListItem className="!p-0">
        <ListItemText>Název: {event.event.title}</ListItemText>
      </ListItem>
      <ListItem className="!p-0">
        <ListItemText>Pokoje: {rooms.map((item: any) => item.id).join(",")}</ListItemText>
      </ListItem>
      <ListItem className='!p-0'>
        <ListItemText>Vedoucí: {getFullName(leader)}</ListItemText>
      </ListItem>
      <ListItem className="!p-0">
        <ListItemText>Status: {display_name}</ListItemText>
      </ListItem>
    </List>}>
      <p>{event.event.title}</p>
    </Tooltip>
  }

  const handleBlocation = async () => {
    setBlockedDates({ from_date: selectedDays[0], to_date: dayjs(selectedDays[1]).subtract(1, "day").format("YYYY-MM-DD") })
    setSelectedDays([])
    refresh()
  }

  return (
    <Paper className="flex w-full h-full sm:flex-row flex-col p-2">
      <div className='flex flex-col sm:mr-2 mb-2 gap-2'>
        <div className="flex sm:flex-col flex-row gap-2">
          <Typography variant="h6" className='!font-semibold text-center w-full'>
            {calendarTitle}
          </Typography>
          <ButtonGroup size="small" fullWidth>
            <Button onClick={() => mutateCalendar("prev")}>
              <NavigateBefore />
            </Button>
            <Button onClick={() => mutateCalendar("next")}>
              <NavigateNext />
            </Button>
          </ButtonGroup>
          <Button variant="outlined" size="small" onClick={() => mutateCalendar("today")}>Dnes</Button>
        </div>
        <ToggleButtonGroup orientation='vertical' className='sm:flex-col flex-row' size='small' onChange={handleRoomsFilterChange} value={roomsFilter}>
          <ToggleButton value="all" selected={roomsEnum.list.length === roomsFilter.length}>Celá chata</ToggleButton>
          {roomsEnum.list.map(rooms => (
            <ToggleButton key={rooms.id} value={rooms.id}>{rooms.label}</ToggleButton>
          ))}
        </ToggleButtonGroup>

        {role.id === 1 && <Tooltip title="Kliknutím nebo potažením mezi jednotlivými dny vyberete období k blokaci">
          <span>
            <Button variant='contained' fullWidth disabled={!selectedDays.length} onClick={handleBlocation} size="small">Blokovat</Button>
          </span>
        </Tooltip>
        }</div>
      <div className='flex-1' style={{ minHeight: 450 }}>
        <FullCalendar selectable={role.id === 1} ref={calendarRef} height="100%" locale={csLocale} headerToolbar={{ right: "", left: "" }} plugins={[dayGridPlugin, interactionPlugin]} initialView="dayGridMonth" events={calendarEventData} eventContent={eventContentInjection} select={(date) => setSelectedDays([date.start, date.end])} unselect={() => setSelectedDays([])} unselectCancel='.MuiButtonBase-root' defaultAllDay />
      </div>
    </Paper >
  )
}
