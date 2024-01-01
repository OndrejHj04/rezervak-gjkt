"use client";
import { store } from "@/store/store";
import { Box, Skeleton, Typography } from "@mui/material";
import WelcomeComponent from "../sub-components/WelcomeComponent";
import SleepingUserInfo from "../sub-components/SleepingUserInfo";
import VerifyUser from "../sub-components/VerifyUser";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function HomepageLoading({
  homepage,
  user,
}: {
  user: any;
  homepage: JSX.Element;
}) {
  const { status, data, update } = useSession();

  useEffect(() => {
    if (
      (data?.user.active !== user.active ||
        data?.user.verified !== user.verified) &&
      status === "authenticated"
    ) {
      update({ active: user.active, verified: user.verified });
    }
  }, [status]);

  if (status === "loading") {
  return <Typography>loading</Typography>;
  }

  if (status === "unauthenticated") {
    return <WelcomeComponent />;
  }

  if (status === "authenticated" && !data?.user.verified) {
    return (
      <>
        <div className="absolute z-50">
          <VerifyUser id={data?.user.id} />
        </div>
        <Box sx={{ filter: "blur(5px)" }}>{homepage}</Box>
      </>
    );
  }

  if (status === "authenticated" && !data?.user.active) {
    return (
      <>
        <div className="absolute z-50">
          <SleepingUserInfo />
        </div>
        <Box sx={{ filter: "blur(5px)" }}>{homepage}</Box>
      </>
    );
  }

  return homepage;
}
