"use client";

import { TablePagination } from "@mui/material";
import { useSearchParams } from "next/navigation";
import MakeGroupRefetch from "./refetch";

export function GroupTablePagination({ count }: { count: number }) {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const pageChange = (_: any, newPage: any) => {
    MakeGroupRefetch(`/group/list?page=${newPage + 1}`);
  };

  return (
    <TablePagination
      component="div"
      count={count}
      page={page - 1}
      onPageChange={pageChange}
      rowsPerPage={10}
      rowsPerPageOptions={[]}
      onRowsPerPageChange={() => {}}
    />
  );
}
