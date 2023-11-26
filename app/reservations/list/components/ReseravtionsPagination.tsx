"use client";

import { TablePagination } from "@mui/material";
import { useSearchParams } from "next/navigation";
import ReservationListMakeRefetch from "../refetch";
import { store } from "@/store/store";

export default function ReservationsPagination({ count }: { count: number }) {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const pageChange = (_: any, newPage: any) => {
    const status = searchParams.get("status");
    if (status) {
      ReservationListMakeRefetch(
        `/reservations/list/?page=${newPage + 1}&status=${status}`
      );
    } else {
      ReservationListMakeRefetch(`/reservations/list/?page=${newPage + 1}`);
    }
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
