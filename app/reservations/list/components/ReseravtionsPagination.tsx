"use client";

import { Reservation } from "@/types";
import { TablePagination } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function ReservationsPagination({
  reservations,
}: {
  reservations: Reservation[];
}) {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const pageChange = (_: any, newPage: any) => {
    const status = searchParams.get("status");
    if (status) {
      push(`/reservations/list/?page=${newPage + 1}&status=${status}`);
    } else {
      push(`/reservations/list/?page=${newPage + 1}`);
    }
  };

  return (
    <TablePagination
      component="div"
      count={reservations.length}
      page={page - 1}
      onPageChange={pageChange}
      rowsPerPage={10}
      rowsPerPageOptions={[]}
      onRowsPerPageChange={() => {}}
    />
  );
}
