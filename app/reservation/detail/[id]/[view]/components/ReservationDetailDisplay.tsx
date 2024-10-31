import { dayjsExtended } from "@/lib/dayjsExtended"
import { rooms } from "@/lib/rooms"
import AvatarWrapper from "@/ui-components/AvatarWrapper"
import { CardHeader, Icon, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material"
import dayjs from "dayjs"
import React from "react"

export default function ReservationDetailDisplay({ reservationDetail }: { reservationDetail: any }) {

  const bedsCount = reservationDetail.rooms.reduce((a: any, b: any) => {
    return a + b.people
  }, 0)

  return (
    <React.Fragment>
      <Typography variant="h5">Vedoucí rezervace:</Typography>
      <CardHeader
        className="!p-0"
        avatar={<AvatarWrapper data={{ image: reservationDetail.leader_image }} size={56} />}
        title={
          <Typography variant="h5">
            {reservationDetail.leader_name}
          </Typography>
        }
        subheader={reservationDetail.leader_email}
      />
      <List>
        <ListItem disablePadding>
          <ListItemText>Název: {reservationDetail.name}</ListItemText>
        </ListItem>
        <ListItem disablePadding>
          <ListItemText>Začátek: {dayjsExtended(reservationDetail.from_date).format("DD. MMMM YYYY")}</ListItemText>
        </ListItem>
        <ListItem disablePadding>
          <ListItemText>Konec: {dayjsExtended(reservationDetail.to_date).format("DD. MMMM YYYY")}</ListItemText>
        </ListItem>
        <ListItem disablePadding>
          <ListItemText>{reservationDetail.rooms.length} pokoje; {bedsCount} lůžek</ListItemText>
        </ListItem>
        <ListItem disablePadding>
          <ListItemText>Důvod: {reservationDetail.purpouse}</ListItemText>
        </ListItem>
        <ListItem disablePadding>
          <ListItemText>Pokyny pro účastníky: {reservationDetail.instructions}</ListItemText>
        </ListItem>
        <ListItem disablePadding className="w-fit">
          <ListItemText>
            Status: {reservationDetail.status_name}
          </ListItemText>
          <ListItemIcon className="ml-2">
            <Icon sx={{ color: reservationDetail.status_color }}>{reservationDetail.status_icon}</Icon>
          </ListItemIcon>
        </ListItem>
        {reservationDetail.success_link && <ListItem disablePadding>
          <ListItemText>Odkaz na registraci na web Pec pod Sněžkou: {reservationDetail.success_link}</ListItemText>
        </ListItem>}
        {reservationDetail.payment_symbol && <ListItem disablePadding>
          <ListItemText>Variabilní symbol pro platbu: {reservationDetail.payment_symbol}</ListItemText>
        </ListItem>}
        {reservationDetail.reject_reason && <ListItem disablePadding>
          <ListItemText>Důvod zamítnutí: {reservationDetail.purpouse}</ListItemText>
        </ListItem>}
      </List>
    </React.Fragment >
  )
}
