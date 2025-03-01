import { Paper } from "@mui/material";
import Sidebar from "./Sidebar";

export default function DataOverviewLayout({ children }: { children: any }) {
  return (
    <div className="flex gap-2 p-2 h-full">
      <Paper className="w-4/5 h-full">{children}</Paper>
      <Paper className="w-1/5 h-full">
        <Sidebar />
      </Paper>
    </div>
  );
}
