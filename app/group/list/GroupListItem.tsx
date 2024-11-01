"use client"

import { getFullName } from "@/app/constants/fullName"
import { groupDelete } from "@/lib/api"
import AvatarWrapper from "@/ui-components/AvatarWrapper"
import { Button, Menu, MenuItem, TableCell, TableRow } from "@mui/material"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import { toast } from "react-toastify"

export default function GroupListItem({ group }: { group: any }) {

  const [anchorEl, setAnchorEl] = useState<any>(null)
  const { refresh } = useRouter()

  const handleDeleteGroups = () => {
    groupDelete({ groupId: group.id }).then(({ success }) => {
      if (success) toast.success("Rezervace úspěšně odstraněny");
      else toast.error("Něco se pokazilo");
    });
    refresh()
  }

  const setMenuPosition = (e: any) => {
    setAnchorEl(
      anchorEl === null
        ? {
          mouseX: e.clientX + 2,
          mouseY: e.clientY - 6,
        }
        : null
    )
  }
  return (
    <React.Fragment>
      <TableRow selected={Boolean(anchorEl)} onClick={setMenuPosition}>
        <TableCell>{group.name}</TableCell>
        <TableCell>{group.description}</TableCell>
        <TableCell className="!flex !items-center !gap-2">
          <AvatarWrapper data={group.owner} />
          {getFullName(group.owner)}
        </TableCell>
        <TableCell>
          {group.users.length}
        </TableCell>
        <TableCell align="right" className="min-w-[150px]" onClick={e => e.stopPropagation()}>
          <Button component={Link} href={`/group/detail/${group.id}/info`}>detail</Button>
        </TableCell>
      </TableRow>
      <Menu open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorReference="anchorPosition"
        anchorPosition={anchorEl !== null
          ? { top: anchorEl.mouseY, left: anchorEl.mouseX }
          : undefined}
      >
        <MenuItem onClick={handleDeleteGroups}>Odstranit skupinu</MenuItem>
      </Menu>
    </React.Fragment>
  )
}
