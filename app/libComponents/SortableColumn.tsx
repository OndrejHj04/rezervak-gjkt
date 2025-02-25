"use client";

import { Sort, TrendingDown, TrendingUp } from "@mui/icons-material";
import { Icon, TableCell } from "@mui/material";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function SortableColumn({ children, id }: any) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const status = searchParams.get("dir") || "";
  const sortId = searchParams.get("sort") || "";

  const handleSortColumn = (e: any) => {
    const params = new URLSearchParams(searchParams);
    let newDirection = status === "" ? "desc" : status === "desc" ? "asc" : "";
    if (params.get("sort") !== id) newDirection = "desc";

    params.delete("page");
    params.set("sort", id);
    if (newDirection.length) params.set("dir", newDirection);
    else params.delete("dir");

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <TableCell onClick={handleSortColumn} className="cursor-pointer group">
      <div className="flex items-center gap-1">
        {children}
        {sortId === id && status === "asc" && <TrendingUp fontSize="small" />}
        {sortId === id && status === "desc" && (
          <TrendingDown fontSize="small" />
        )}
        {(status === "" || sortId !== id) && (
          <Sort className="opacity-0 group-hover:opacity-50" fontSize="small" />
        )}
      </div>
    </TableCell>
  );
}
