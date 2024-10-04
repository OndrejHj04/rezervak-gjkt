"use client"
import { ArrowDropDown } from "@mui/icons-material";
import { IconButton, Menu, MenuItem } from "@mui/material";
import React, { useState } from "react";
import SwitchUserMenuItem from "./SwitchUserMenuItem";

export default function SwitchUserMenu() {
  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>()

  return (
    <React.Fragment>
      <IconButton disabled onClick={(e) => setAnchorElement(e.currentTarget)} className="w-min rounded-none">
        <ArrowDropDown />
      </IconButton>
      <Menu className="!p-0" MenuListProps={{ className: "!p-0" }} anchorEl={anchorElement} transformOrigin={{ horizontal: "right", vertical: "top" }} open={Boolean(anchorElement)} onClose={() => setAnchorElement(null)} >

      </Menu>
    </React.Fragment>
  )
}
