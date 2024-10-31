"use client";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  ButtonGroup,
  FormControl,
  FormControlLabel,
  Icon,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Radio,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React, { useEffect, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";

import { Controller, useForm } from "react-hook-form";
import { store } from "@/store/store";
import FullCalendar from "@fullcalendar/react";
import resourceTimelineWeek from "@fullcalendar/resource-timeline"

import csLocale from "@fullcalendar/core/locales/cs"
import { NavigateBefore, NavigateNext } from "@mui/icons-material";
import { roomsEnum } from "@/app/constants/rooms";
import { getFullName } from "@/app/constants/fullName";
import { DatePicker } from "@mui/x-date-pickers";

export default function ReservationDatesRender({
  reservations,
}: {
  reservations: any[];
}) {
  const { createReservation, setCreateReservation } = store();
  const [expanded, setExpanded] = useState(false);
  const isValid = createReservation.from_date && createReservation.to_date
  const calendarRef = useRef(null)
  const [calendarTitle, setCalendarTitle] = useState("")
  const { handleSubmit, control, watch, formState, reset, register, setValue } = useForm({
    defaultValues: { from_date: null, to_date: null, rooms: [1, 2, 3, 4, 5] },
  });

  const { from_date, to_date, rooms } = watch();

  const onSubmit = ({
    from_date,
    to_date,
  }: {
    from_date: any;
    to_date: any;
  }) => {
    setExpanded(false);
    setCreateReservation({ ...createReservation, from_date: dayjs(from_date).format("YYYY-MM-DD"), to_date: dayjs(to_date).format("YYYY-MM-DD"), rooms });
  };

  useEffect(() => {
    const calendarApi = (calendarRef.current as any).getApi()
    setCalendarTitle(calendarApi.currentData.viewTitle)
  }, [])

  const calendarEventData = useMemo(() => {
    const reservationData = reservations.map(reservation => ({
      id: reservation.id,
      title: reservation.name,
      start: reservation.from_date,
      end: dayjs(reservation.to_date).add(1, "day").format("YYYY-MM-DD"),
      resourceIds: reservation.rooms.map(({ id }: any) => id),
      leader: reservation.leader,
      color: reservation.status.color,
      icon: reservation.status.icon,
      display_name: reservation.status.display_name
    }))

    if (from_date && to_date) {
      reservationData.push({ id: "custom", title: "Nová rezervace", start: dayjs(from_date).toDate(), end: dayjs(to_date).add(1, "day").toDate(), resourceIds: rooms, leader: {} } as any)
    }

    return reservationData
  }, [from_date, to_date, rooms])

  const calendarResources = useMemo(() => {
    return roomsEnum.list.map((room) => ({ id: room.id, title: room.label }))
  }, [])

  const bedsCount = useMemo(() => {
    return roomsEnum.list.reduce((a, b) => {
      if (rooms.includes(b.id as never)) {
        a += b.capacity
      }
      return a
    }, 0)
  }, [rooms])

  useEffect(() => {
    if (dayjs(from_date).isValid() && dayjs(to_date).isValid()) {
      const calendarApi = (calendarRef.current as any).getApi()
      calendarApi.gotoDate(dayjs(from_date).toISOString())
      setCalendarTitle(calendarApi.currentData.viewTitle)
    }
  }, [from_date, to_date])

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
      <ListItem className='!p-0'>
        <ListItemText>Vedoucí: {getFullName(leader)}</ListItemText>
      </ListItem>
      <ListItem className="!p-0">
        <ListItemText>Status: {display_name}</ListItemText>
        <ListItemIcon className='min-w-0 ml-2'>
          {<Icon sx={{ color: event.event.backgroundColor }}>{icon}</Icon>}    </ListItemIcon>      </ListItem>
    </List>}>
      <p>{event.event.title}</p>
    </Tooltip>
  }

  const resetSection = () => {
    reset()
    mutateCalendar("today")
    setCreateReservation({ ...createReservation, from_date: "", to_date: "", rooms: [] });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit as any)}>
      <Accordion expanded={expanded}>
        <AccordionSummary
          onClick={() => setExpanded((c) => !c)}
          expandIcon={
            isValid && !expanded ? (
              <CheckCircleIcon color="success" />
            ) : (
              <ExpandMoreIcon />
            )
          }
        >
          <Typography variant="h6">Termín a pokoje rezervace</Typography>
        </AccordionSummary>
        <AccordionDetails className="p-2 flex md:flex-row flex-col gap-2">
          <div className="md:w-[810px] w-auto">
            <div className="flex gap-2 mb-2">
              <ButtonGroup size="small">
                <Button onClick={() => mutateCalendar("prev")}>
                  <NavigateBefore />
                </Button>
                <Button onClick={() => mutateCalendar("next")}>
                  <NavigateNext />
                </Button>
              </ButtonGroup>
              <Button variant="outlined" size="small" onClick={() => mutateCalendar("today")}>Dnes</Button>
              <Typography variant="h6" className='!font-semibold'>
                {calendarTitle}
              </Typography>
            </div>
            <FullCalendar ref={calendarRef} contentHeight="auto" locale={csLocale} plugins={[resourceTimelineWeek]} initialView="resourceTimelineWeek" events={calendarEventData} slotDuration={{ days: 1 }} slotLabelFormat={{ weekday: "short", day: "numeric", month: "numeric" }} resources={calendarResources} resourceAreaHeaderContent="Pokoje" slotMinWidth={100} resourceAreaWidth="101px" eventContent={eventContentInjection} />
          </div>
          <div className="flex flex-col md:mt-[33.5px] mt-0 gap-3">
            <Controller control={control} name="from_date" rules={{ required: true }} render={({ field }) => (
              <DatePicker label="Začátek rezervace" minDate={dayjs()} maxDate={dayjs(to_date).subtract(1, "day")} {...field} format="DD. MM. YYYY" />
            )} />
            <Controller control={control} name="to_date" rules={{ required: true }} render={({ field }) => (
              <DatePicker label="Konec rezervace" {...field} minDate={dayjs(from_date).isValid() ? dayjs(from_date).add(1, "day") : dayjs()} format="DD. MM. YYYY" />
            )} />
            <Controller control={control} name="rooms" render={({ field }) => (
              <FormControl>
                <InputLabel id="rooms-label">Pokoje</InputLabel>
                <Select {...field} multiple label="Label" id="rooms" labelId="rooms-label">
                  {roomsEnum.list.map((room) => (
                    <MenuItem key={room.id} value={room.id}>
                      {room.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )} />
            <div className="-my-3">
              <FormControlLabel control={<Radio checked={rooms.length === 5} />} label="Všechny pokoje" onClick={() => setValue("rooms", [1, 2, 3, 4, 5])} />
              <FormControlLabel control={<Radio checked={rooms.length === 0} />} label="Žádný pokoj" onClick={() => setValue("rooms", [])} />
            </div>
            <Typography>Celkem vybráno lůžek {bedsCount}</Typography>
            <div>
              <Button variant="contained" type="submit" className="!mr-2" disabled={!formState.isValid}>Uložit</Button>
              <Button variant="contained" color="error" onClick={resetSection} disabled={!isValid && !formState.isDirty}>Smazat</Button>
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </form >
  );
}
