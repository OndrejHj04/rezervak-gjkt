import { store } from "@/store/store";
import SleepingUserInfo from "@/sub-components/SleepingUserInfo";
import VerifyUser from "@/sub-components/VerifyUser";
import WelcomeComponent from "@/sub-components/WelcomeComponent";
import {
  Box,
  MenuItem,
  MenuList,
  Paper,
  Skeleton,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Group } from "@/types";
import { useRouter } from "next/navigation";
import DisplayGroups from "@/sub-components/DisplayGroups";
import HomepageLoading from "@/sub-components/HomepageLoading";
import DisplayReservations from "@/sub-components/DisplayReservations";
import HomepageCalendar from "@/sub-components/HomepageCalendar";

export default function Home() {
  const homepage = (
    <>
      <DisplayGroups />
      <DisplayReservations />
      <HomepageCalendar />
    </>
  );

  return <HomepageLoading homepage={homepage} />;
}
