import AvatarWrapper from "@/ui-components/AvatarWrapper"
import { Create, DoneAll, EditCalendar, FiberNew, FolderDeleteOutlined, GppBad, GroupAdd, GroupRemove, NightShelter, PersonAdd, PersonRemove, RunningWithErrors, Update, UpdateDisabled } from "@mui/icons-material"
import { TimelineConnector, TimelineContent, TimelineDot, TimelineSeparator } from "@mui/lab"
import { AvatarGroup, ListItemText } from "@mui/material"
import dayjs from "dayjs"
import React from "react"

// 0 - reservation create
// 1 - reservation start
// 2 - reservation end
// 3 - reservation archive
// 10 - user events
// 20 - groups events
// 30 - description change
// 40 - date change
// 50 - status change
// 60 - rooms change

type reservationEventIds = 0 | 1 | 2 | 3 | 4 | 10 | 11 | 20 | 21 | 30 | 40 | 50 | 51 | 52 | 53 | 54 | 55 | 60

export function TimelineEventDescription(eventTypeId: reservationEventIds) {
  switch (eventTypeId) {
    case 0:
      return "Vytvoření rezervace"
    case 1:
      return "Začátek rezervace"
    case 2:
      return "Konec rezervace"
    case 3:
      return "Plánovaná archivace"
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
    case 60:
      return "Změna pokojů"
  }
}

export default function TimelineEventUi(event: any) {
  const dotProps = {}
  const renderUi = () => {
    switch (event.timelineEventTypeId as reservationEventIds) {
      case 0:
        return (
          <React.Fragment>
            <TimelineSeparator>
              <TimelineDot color="success" {...dotProps}>
                <FiberNew />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent className="w-60">
            </TimelineContent>
          </React.Fragment>
        )
      case 1:
        return (
          <React.Fragment>
            <TimelineSeparator>
              <TimelineDot color="success" {...dotProps}>
                <Update />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent className="w-60">
            </TimelineContent>
          </React.Fragment>
        )
      case 2:
        return (
          <React.Fragment>
            <TimelineSeparator>
              <TimelineDot color="error" {...dotProps}>
                <UpdateDisabled />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent className="w-60">
            </TimelineContent>
          </React.Fragment>
        )
      case 3:
        return (
          <React.Fragment>
            <TimelineSeparator>
              <TimelineDot color="grey" {...dotProps}>
                <FolderDeleteOutlined />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent className="w-60">
            </TimelineContent>
          </React.Fragment>
        )
      case 11:
        return (
          <React.Fragment>
            <TimelineSeparator>
              <TimelineDot color="success" {...dotProps}>
                <PersonAdd />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
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
      case 60:
        return (
          <React.Fragment>
            <TimelineSeparator>
              <TimelineDot sx={{ background: "#ED9191", color: "black" }} {...dotProps}>
                <NightShelter />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
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
