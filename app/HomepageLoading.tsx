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
  const { status } = useSession();

  if (status === "loading") {
    return <Typography>loading</Typography>;
  }

  if (status === "unauthenticated") {
    return <WelcomeComponent />;
  }
  // if (userLoading)
  //   return (
  //     <>
  //       <Skeleton variant="rectangular" width={300} height={170} />
  //       <Skeleton variant="rectangular" width={200} height={250} />
  //       <Skeleton variant="rectangular" width={300} height={170} />
  //       <Skeleton variant="circular" width={30} height={30} />
  //     </>
  //   );

  // if (!user && !userLoading) {
  //   return <WelcomeComponent />;
  // }

  // if (!user?.active && user?.role.id !== 1) {
  //   return (
  //     <>
  //       <div className="absolute z-50">
  //         <SleepingUserInfo />
  //       </div>
  //       <Box sx={{ filter: "blur(5px)" }}>{homepage}</Box>
  //     </>
  //   );
  // }

  // if (!user?.verified) {
  //   return (
  //     <>
  //       <div className="absolute z-50">
  //         <VerifyUser id={user?.id} />
  //       </div>
  //       <Box sx={{ filter: "blur(5px)" }}>{homepage}</Box>
  //     </>
  //   );
  // }

  return homepage;
}
