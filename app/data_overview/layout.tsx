import { Divider, Paper, Typography } from "@mui/material";
import FusionForm from "./sidebarComponents/FusionForm";
import { ResetFiltersButton } from "./sidebarComponents/ResetFiltersButton";

export default function DataOverviewLayout({ children }: { children: any }) {
  return (
    <div className="flex gap-2 p-2 h-full">
      <Paper className="w-4/5 h-full">{children}</Paper>
      <Paper className="w-1/5 h-full">
        <div className="h-full flex flex-col">
          <Typography variant="h5" className="text-center">
            Nastavení
          </Typography>
          <Divider />
          <FusionForm />
          <ResetFiltersButton className="mt-auto" />
        </div>
      </Paper>
    </div>
  );
}
