"use client";
import { store } from "@/store/store";
import SleepingUserInfo from "@/sub-components/SleepingUserInfo";
import VerifyUser from "@/sub-components/VerifyUser";
import WelcomeComponent from "@/sub-components/WelcomeComponent";
import { Box, Skeleton, Typography } from "@mui/material";
import { useSession } from "next-auth/react";

export default function Home() {
  const { user, userLoading } = store();

  const homepage = (
    <Typography>
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Accusantium
      assumenda, consectetur aliquid omnis, est, labore similique sapiente
      numquam unde voluptatum consequatur quae eum ea. Praesentium quia hic
      asperiores exercitationem repudiandae.
    </Typography>
  );

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

  if (!user?.verified && user?.role.role_id !== 1) {
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
