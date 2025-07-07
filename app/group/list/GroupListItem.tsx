"use client"

import { getFullName } from "@/app/constants/fullName"
import { groupDelete } from "@/lib/api"
import AvatarWrapper from "@/ui-components/AvatarWrapper"
import { Button, Menu, MenuItem, TableCell, TableRow } from "@mui/material"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import { toast } from "react-toastify"

export default function GroupListItem({ group, allowMenu }: { group: any, allowMenu: any }) {
  const { refresh } = useRouter()
  const [selectedGroup, setSelectedGroup] = useState<{ id: number, mouseX: number, mouseY: number } | null>(null)

  const handleDeleteGroups = () => {
    groupDelete({ groupId: group.id }).then(({ success }) => {
      if (success) toast.success("Rezervace úspěšně odstraněny");
      else toast.error("Něco se pokazilo");
    });
    refresh()
  }

  const isSelected = selectedGroup !== null && selectedGroup.id === group.id

  const setMenuPosition = (e: any) => {
    if (isSelected || !allowMenu) {
      setSelectedGroup(null)
    } else {
      setSelectedGroup({
        mouseX: e.clientX + 2,
        mouseY: e.clientY - 6,
        id: group.id
      })
    }
  }

  return (
    <React.Fragment>
      <TableRow selected={isSelected} onClick={setMenuPosition}>
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
      <Menu open={Boolean(isSelected)}
        onClose={() => setSelectedGroup(null)}
        anchorReference="anchorPosition"
        anchorPosition={selectedGroup !== null
          ? { top: selectedGroup.mouseY, left: selectedGroup.mouseX }
          : undefined}
      >
        <MenuItem onClick={handleDeleteGroups}>Odstranit skupinu</MenuItem>
      </Menu>
    </React.Fragment>
  )
}
