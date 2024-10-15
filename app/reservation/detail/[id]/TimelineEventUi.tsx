import { Create, DoneAll, EditCalendar, GppBad, GroupAdd, GroupRemove, PersonAdd, PersonRemove, RunningWithErrors } from "@mui/icons-material"
import { TimelineConnector, TimelineContent, TimelineDot, TimelineSeparator } from "@mui/lab"
import React, { useCallback } from "react"

// 1 - user events
// 2 - groups events
// 3 - description change
// 4 - date change
// 5 - status change

type reservationEventIds = 10 | 11 | 20 | 21 | 30 | 40 | 50 | 51 | 52 | 53 | 54 | 55

export default function TimelineEventUi(event: reservationEventIds) {
  const dotProps = {}
  const renderUi = () => {
    switch (event) {
      case 11:
        return (
          <React.Fragment>
            <TimelineSeparator>
              <TimelineDot color="success" {...dotProps}>
                <PersonAdd />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>data</TimelineContent>
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
            <TimelineContent>data</TimelineContent>
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
            <TimelineContent>data</TimelineContent>
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
            <TimelineContent>data</TimelineContent>
          </React.Fragment>
        )
      case 30:
        return (
          <React.Fragment>
            <TimelineSeparator>
              <TimelineDot color="info" {...dotProps}>
                <Create />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>data</TimelineContent>
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
            <TimelineContent>data</TimelineContent>
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
            <TimelineContent>data</TimelineContent>
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
            <TimelineContent>data</TimelineContent>
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
            <TimelineContent>data</TimelineContent>
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
