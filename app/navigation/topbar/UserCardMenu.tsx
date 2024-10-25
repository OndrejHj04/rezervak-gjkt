import React from "react"
import { Button, Typography } from "@mui/material"
import Link from "next/link"
import AvatarWrapper from "@/ui-components/AvatarWrapper"

export default async function TopBarUserCard({ data }: { data: any }) {
  return (
    <React.Fragment>
      <div className="flex">
        <Button component={Link} href={`/user/detail/${data.id}`}>
          <div className="flex-col mx-4 items-end normal-case text-white sm:flex hidden">
            <Typography className="!font-semibold capitalize" variant="body1">
              {data.first_name} {data.last_name}
            </Typography>
            <div className="flex gap-1 items-center">
              <Typography variant="body2">{data.role.name}</Typography>
            </div>
          </div>
          <AvatarWrapper data={data} />
        </Button>
      </div>
    </React.Fragment>

  )
}

