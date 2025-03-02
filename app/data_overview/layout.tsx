"use client";
import { Paper } from "@mui/material";
import FusionForm from "./sidebarComponents/FusionForm";
import { ResetFiltersButton } from "./sidebarComponents/ResetFiltersButton";
import FilterByDate from "./sidebarComponents/FilterByDate";
import { useEffect } from "react";
import { store } from "@/store/store";
import dayjs from "dayjs";

export default function DataOverviewLayout({ children }: { children: any }) {
  const { setFusionData } = store();

  useEffect(() => {
    const timestamp = dayjs(localStorage.getItem("fusion_timestamp"));
    if (timestamp.isValid() && dayjs().diff(timestamp, "hour") > 1) {
      localStorage.removeItem("fusion");
    }

    const data = localStorage.getItem("fusion") || ("[]" as any);
    setFusionData(JSON.parse(data));
  }, []);

  return (
    <div className="flex gap-2 p-2 h-full">
      <Paper className="w-4/5 h-full">{children}</Paper>
      <Paper className="w-1/5 h-full">
        <div className="h-full flex flex-col gap-2">
          <FusionForm />
          <FilterByDate />
          <ResetFiltersButton className="mt-auto" />
        </div>
      </Paper>
    </div>
  );
}
