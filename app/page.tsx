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
import DisplayGroups from "@/app/homepage/reservations/DisplayReservations";
import HomepageLoading from "@/sub-components/HomepageLoading";
import DisplayReservations from "@/app/homepage/groups/DisplayGroups";
import HomepageCalendar from "@/app/homepage/calendar/HomepageCalendar";

export default function Home() {
  const homepage = (
    <div className="flex gap-2 h-min">
      <DisplayGroups />
      <DisplayReservations />
      <HomepageCalendar />
    </div>
  );

  return <HomepageLoading homepage={homepage} />;
}
