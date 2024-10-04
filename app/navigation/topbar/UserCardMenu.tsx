import React from "react"
import {Divider} from "@mui/material"
import SwitchUserMenuItem from "./ui/SwitchUserMenuItem"
import SwitchUserMenu from "./ui/SwitchUserMenu"

export default async function TopBarUserCard({ data }: { data: any }) {

  return (
    <React.Fragment>
      <div className="flex">
        <SwitchUserMenuItem user={data.user} type="display" />
        <Divider orientation="vertical" flexItem />
        <SwitchUserMenu/>
      </div>
    </React.Fragment>

  )
}

