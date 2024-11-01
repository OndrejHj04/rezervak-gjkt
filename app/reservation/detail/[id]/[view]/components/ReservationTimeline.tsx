import { smartTime } from "@/app/constants/smartTime"
import { getReservationTimeline } from "@/lib/api"
import { Timeline, TimelineContent, TimelineItem } from "@mui/lab"
import TimelineEventUi from "../../TimelineEventUi"
import { Typography } from "@mui/material"
import TimelineToggle from "../../TimelineToggle"

export default async function ReservationTimeline({ id, page, timeline = "new" }: { id: any, page: any, timeline: any }) {

  const { data, count } = await getReservationTimeline({ reservationId: id, mode: timeline })

  return (
    <div>
      <TimelineToggle />
      <Timeline className="before:[&_.MuiTimelineItem-root]:hidden [&_.MuiTimelineContent-root]:pt-5 [&_.MuiTimelineItem-root:last-of-type_.MuiTimelineConnector-root]:hidden">
        {data.map((event: any, i) => (
          <TimelineItem key={i} className="">
            <TimelineContent className="flex justify-end">
              <Typography color="text.secondary">{smartTime(event.timestamp)}</Typography>
            </TimelineContent>
            {TimelineEventUi(event)}
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  )
}
