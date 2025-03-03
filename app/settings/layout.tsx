import { Button, Paper, Typography } from "@mui/material";

export default function Layout({ children }: any) {
  return (
    <div className="w-full h-full flex flex-col px-2">
      <div className="flex justify-between mb-1">
        <Typography variant="h5">Nastavení</Typography>
      </div>
      <Paper className="w-full h-full p-2">{children}</Paper>
    </div>
  );
}
