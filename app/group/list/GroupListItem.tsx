"use client"

import { getFullName } from "@/app/constants/fullName"
import { groupsDelete } from "@/lib/api"
import { store } from "@/store/store"
import AvatarWrapper from "@/ui-components/AvatarWrapper"
import { Button, Menu, MenuItem, TableCell, TableRow } from "@mui/material"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import { toast } from "react-toastify"

export default function GroupListItem({ group }: { group: any }) {

  const [contextMenu, setContextMenu] = useState<any>(null)
  const { selectedGroups, setSelectedGroups } = store()
  const { refresh } = useRouter()


  const handleSelectGroup = () => {
    if (selectedGroups.includes(group.id)) {
      setSelectedGroups(selectedGroups.filter((res: any) => res !== group.id))
    } else {
      setSelectedGroups([...selectedGroups, group.id])
    }
  }

  const handleDeleteGroups = () => {
    groupsDelete({ groups: selectedGroups }).then(({ success }) => {
      if (success) toast.success("Rezervace úspěšně odstraněny");
      else toast.error("Něco se pokazilo");
    });
    refresh()
    setSelectedGroups([]);
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setContextMenu(
      contextMenu === null && selectedGroups.includes(group.id)
        ? {
          mouseX: e.clientX + 2,
          mouseY: e.clientY - 6,
        }
        : null,
    );
  };

  const handleClose = () => {
    setContextMenu(null);
  }

  return (
    <React.Fragment>
      <TableRow key={group.id} onContextMenu={handleContextMenu} selected={selectedGroups.includes(group.id)} onClick={handleSelectGroup}>
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
      <Menu open={Boolean(contextMenu)}
        onClose={handleClose}
        className="[&_.MuiList-root]:!p-0"
        anchorReference="anchorPosition"
        anchorPosition={contextMenu !== null
          ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
          : undefined}
      >
        <MenuItem onClick={handleDeleteGroups}>Odstranit vybrané</MenuItem>
      </Menu>
    </React.Fragment>
  )
}
