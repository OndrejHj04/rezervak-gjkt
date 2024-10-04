import AvatarWrapper from "@/ui-components/AvatarWrapper"
import { Button, Typography } from "@mui/material"
import Link from "next/link"

type SwitchUserMenuItemType = {
  user: any
  type: "sign-in" | "display"
}

export default function SwitchUserMenuItem({ user, type }: SwitchUserMenuItemType) {
  const handleSignIn = () => {
    /* signIn("credentials", {
      email: "",
      password: ""
    }) */
  }

  const content = (
    <Button {...(type === "sign-in" ? { onClick: handleSignIn } : {})}>
      <div className="flex-col mx-4 items-end normal-case text-white sm:flex hidden">
        <Typography className="!font-semibold capitalize" variant="body1">
          {user.first_name} {user.last_name}
        </Typography>
        <div className="flex gap-1 items-center">
          <Typography variant="body2">{user.role.name}</Typography>
        </div>
      </div>
      <AvatarWrapper data={user} />
    </Button>)

  if (type === "sign-in") return content

  return (
    <Link href={`/user/detail/${user.id}`}>
      {content}
    </Link>)
}
