"use client";
import { store } from "@/store/store";
import { Box, Skeleton } from "@mui/material";
import WelcomeComponent from "./WelcomeComponent";
import SleepingUserInfo from "./SleepingUserInfo";
import VerifyUser from "./VerifyUser";

export default function HomepageLoading({
  homepage,
}: {
  homepage: JSX.Element;
}) {
  const { user, userLoading } = store();

  if (userLoading)
    return (
      <>
        <Skeleton variant="rectangular" width={300} height={170} />
        <Skeleton variant="rectangular" width={200} height={250} />
        <Skeleton variant="rectangular" width={300} height={170} />
        <Skeleton variant="circular" width={30} height={30} />
      </>
    );

  if (!user && !userLoading) {
    return <WelcomeComponent />;
  }

  if (!user?.active && user?.role.role_id !== 1) {
    return (
      <>
        <div className="absolute z-50">
          <SleepingUserInfo />
        </div>
        <Box sx={{ filter: "blur(5px)" }}>{homepage}</Box>
      </>
    );
  }

  if (!user?.verified) {
    return (
      <>
        <div className="absolute z-50">
          <VerifyUser id={user?.id} />
        </div>
        <Box sx={{ filter: "blur(5px)" }}>{homepage}</Box>
      </>
    );
  }

  return homepage;
}
