"use client";
import { store } from "@/store/store";
import { Box, CircularProgress, Skeleton, Typography } from "@mui/material";
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
      status === "authenticated" &&
      (data?.user.active !== user.active ||
        data?.user.verified !== user.verified ||
        data?.user.role.id !== user.role.id)
    ) {
      update({ active: user.active, verified: user.verified, role: user.role });
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="flex justify-center">
        <CircularProgress />
      </div>
    );
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
