import { Skeleton } from "@mui/material";

export default function Loading() {
  return (
    <div className="flex flex-col gap-2">
      {[...Array(10)].map((_, i) => (
        <Skeleton key={i} variant="rectangular" animation="wave" height={40} />
      ))}
    </div>
  );
}
