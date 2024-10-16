import AvatarWrapper from "@/ui-components/AvatarWrapper"
import { Create, DoneAll, EditCalendar, GppBad, GroupAdd, GroupRemove, PersonAdd, PersonRemove, RunningWithErrors } from "@mui/icons-material"
import { TimelineConnector, TimelineContent, TimelineDot, TimelineSeparator } from "@mui/lab"
import { AvatarGroup, ListItemText, Typography } from "@mui/material"
import dayjs from "dayjs"
import React, { useCallback } from "react"

// 1 - user events
// 2 - groups events
// 3 - description change
// 4 - date change
// 5 - status change

type reservationEventIds = 10 | 11 | 20 | 21 | 30 | 40 | 50 | 51 | 52 | 53 | 54 | 55

export function TimelineEventDescription(eventTypeId: reservationEventIds) {
  switch (eventTypeId) {
    case 10:
      return "Odebrání uživatelů"
    case 11:
      return "Přidání uživatelů"
    case 20:
      return "Odpojení skupiny"
    case 21:
      return "Připojení skupiny"
    case 30:
      return "Úprava popisku"
    case 40:
      return "Změna data"
    case 52:
      return "Čeká na schválení"
    case 53:
      return "Potvrzení rezervace"
    case 54:
      return "Zamítnutí rezervace"
  }
}

export default function TimelineEventUi(event: any) {
  const dotProps = {}
  const renderUi = () => {
    switch (event.timelineEventTypeId as reservationEventIds) {
      case 11:
        return (
          <React.Fragment>
            <TimelineSeparator>
              <TimelineDot color="success" {...dotProps}>
                <PersonAdd />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent className="w-60">
              <AvatarGroup max={3} className="w-fit">
                {event.users.map((user: any) => (
                  <AvatarWrapper key={user.id} data={user} size={32} />
                ))}
              </AvatarGroup>
            </TimelineContent>
          </React.Fragment>
        )
      case 10:
        return (
          <React.Fragment>
            <TimelineSeparator>
              <TimelineDot color="error" sx={{ color: "black" }} {...dotProps}>
                <PersonRemove />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator >
            <TimelineContent>
              <AvatarGroup max={3} className="w-fit">
                {event.users.map((user: any) => (
                  <AvatarWrapper key={user.id} data={user} size={32} />
                ))}
              </AvatarGroup>
            </TimelineContent>
          </React.Fragment>
        )
      case 20:
        return (
          <React.Fragment>
            <TimelineSeparator>
              <TimelineDot color="error" {...dotProps}>
                <GroupRemove />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              {event.groups.map((group: any, i: any) => (
                <ListItemText primary={group.name} secondary={`Majitel: ${group.owner.first_name} ${group.owner.last_name}`} key={i} />
              ))}
            </TimelineContent>
          </React.Fragment>
        )
      case 21:
        return (
          <React.Fragment>
            <TimelineSeparator>
              <TimelineDot color="success" {...dotProps}>
                <GroupAdd />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              {event.groups.map((group: any, i: any) => (
                <ListItemText primary={group.name} secondary={`Majitel: ${group.owner.first_name} ${group.owner.last_name}`} key={i} />
              ))}
            </TimelineContent>
          </React.Fragment>
        )
      case 30:
        const translate = { purpouse: "Důvod", name: "Název", instructions: "Instrukce" } as any
        return (
          <React.Fragment>
            <TimelineSeparator>
              <TimelineDot color="info" {...dotProps}>
                <Create />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent component={"div"} className="">
              {event.difference.map((item: any, i: any) => (
                <ListItemText className="my-0" secondaryTypographyProps={{ className: "line-through" }} key={i} primary={`${translate[item]}: ${event.after[item]}`} secondary={`${translate[item]}: ${event.before[item]}`} />
              ))}
            </TimelineContent>
          </React.Fragment>
        )
      case 40:
        return (
          <React.Fragment>
            <TimelineSeparator>
              <TimelineDot color="info" {...dotProps}>
                <EditCalendar />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent className="" component={"div"}>
              <ListItemText className="!my-0" secondaryTypographyProps={{ className: 'line-through' }} primary={`${dayjs(event.after.after_from_date).format("DD. MM.")} - ${dayjs(event.after.after_to_date).format("DD. MM.")}`} secondary={`${dayjs(event.before.before_from_date).format("DD. MM.")} - ${dayjs(event.before.before_to_date).format("DD. MM.")}`} />
            </TimelineContent>
          </React.Fragment>
        )
      case 52:
        return (
          <React.Fragment>
            <TimelineSeparator>
              <TimelineDot sx={{ background: "#FCD34D", color: "black" }} {...dotProps}>
                <RunningWithErrors />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent></TimelineContent>
          </React.Fragment>
        )
      case 53:
        return (
          <React.Fragment>
            <TimelineSeparator>
              <TimelineDot sx={{ background: "#34D399", color: "black" }} {...dotProps}>
                <DoneAll />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <ListItemText className="!my-0" primary={"Odkaz na registraci:"} secondary={event.success_link} />
            </TimelineContent>
          </React.Fragment>
        )
      case 54:
        return (
          <React.Fragment>
            <TimelineSeparator>
              <TimelineDot sx={{ background: "#ED9191", color: "black" }} {...dotProps}>
                <GppBad />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <ListItemText className="!my-0" primary={"Důvod zamítnutí:"} secondary={event.reject_reason} />
            </TimelineContent>
          </React.Fragment>
        )
    }
  }

  return (
    <React.Fragment>
      {renderUi()}
    </React.Fragment>
  )
}
