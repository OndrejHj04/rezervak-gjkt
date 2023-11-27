import AvatarWrapper from "@/ui-components/AvatarWrapper";
import { Button, Skeleton, Typography } from "@mui/material";
import { stat } from "fs";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function LoginButton() {
  const { status, data } = useSession();

  if (status === "loading") {
    return <Skeleton variant="rounded" width={180} height={50} />;
  }

  if (status === "unauthenticated") {
    return (
      <Link href="/login">
        <Button style={{ color: "white" }}>Přihlásit se</Button>
      </Link>
    );
  }

  if (data?.user) {
    return (
      <Link href={`/user/detail/${data.user.id}`}>
        <Button>
          <div className="flex flex-col mx-4 items-end normal-case text-white">
            <Typography className="font-semibold capitalize" variant="body1">
              {data.user.first_name} {data.user.last_name}
            </Typography>
            <div className="flex gap-1 items-center">
              <Typography variant="body2">
                {data.user.role.role_name}
              </Typography>
            </div>
          </div>
          <AvatarWrapper data={data.user} />
        </Button>
      </Link>
    );
  }
  return null;
}
