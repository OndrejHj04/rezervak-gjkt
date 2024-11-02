import AvatarWrapper from "@/ui-components/AvatarWrapper"
import { Alert, CardHeader, List, ListItem, ListItemText, Typography } from "@mui/material"
import dayjs from "dayjs"
import React from "react"

export default function UserDetailDisplay({ userDetail }: { userDetail: any }) {

  return (
    <React.Fragment>
      <CardHeader
        className="!p-0"
        avatar={<AvatarWrapper data={{ image: userDetail.image }} size={56} />}
        title={
          <Typography variant="h5">
            {userDetail.name}
          </Typography>
        }
        subheader={userDetail.email}
      />
      <List className="w-fit">
        <ListItem disablePadding>
          <ListItemText>Role: {userDetail.role}</ListItemText>
        </ListItem>
        <ListItem disablePadding>
          <ListItemText>Datum narození: {dayjs(userDetail.birth_date).format("DD. MMMM YYYY")}</ListItemText>
        </ListItem>
        <ListItem disablePadding>
          <ListItemText>Adresa: {userDetail.adress}</ListItemText>
        </ListItem>
        <ListItem disablePadding>
          <ListItemText>Číslo OP: {userDetail.ID_code}</ListItemText>
        </ListItem>
        <ListItem disablePadding>
          <ListItemText>Organizace: {userDetail.organization_name}</ListItemText>
        </ListItem>
        {!userDetail.verified && <Alert severity="error">Neověřený účet - uživatel se ještě nepřihlásil a nevyplnil údaje</Alert>}
        {!!userDetail.parent_id && <Alert severity="info">Rodinný účet uživatele: {userDetail.parent_name}.</Alert>}
        {!!userDetail.children && <Alert severity="info">Správce rodinných účtů.</Alert>}
      </List>
    </React.Fragment>
  )
}
