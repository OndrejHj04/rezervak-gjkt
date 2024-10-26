import React from "react"
import { Button, Typography } from "@mui/material"
import Link from "next/link"
import AvatarWrapper from "@/ui-components/AvatarWrapper"

export default async function TopBarUserCard({ user }: { user: any }) {
  if (!user) return null
  return (
    <div className="flex">
      <Button component={Link} href={`/user/detail/${user.id}`}>
        <div className="flex-col mx-4 items-end normal-case text-white sm:flex hidden">
          <Typography className="!font-semibold capitalize" variant="body1">
            {user.first_name} {user.last_name}
          </Typography>
          <div className="flex gap-1 items-center">
            <Typography variant="body2">{user.role.name}</Typography>
          </div>
        </div>
        <AvatarWrapper data={user} />
      </Button>
    </div>
  )
}

