import { Paper } from "@mui/material";

export default function DataOverviewLayout({ children }: { children: any }) {
  return (
    <div className="flex gap-2 p-2 h-full">
      <Paper className="w-4/5 h-full"></Paper>
      <Paper className="w-1/5 h-full"></Paper>
    </div>
  );
}
