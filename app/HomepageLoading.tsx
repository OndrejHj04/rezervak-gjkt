"use client";
import { store } from "@/store/store";
import { Box, Skeleton, Typography } from "@mui/material";
import WelcomeComponent from "../sub-components/WelcomeComponent";
import SleepingUserInfo from "../sub-components/SleepingUserInfo";
import VerifyUser from "../sub-components/VerifyUser";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";

export default function HomepageLoading({
  homepage,
}: {
  homepage: JSX.Element;
}) {
  const { status, data } = useSession();

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

  if (status === "authenticated" && data?.user.sleeping) {
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
