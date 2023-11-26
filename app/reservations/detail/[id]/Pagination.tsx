"use client";
import { TablePagination } from "@mui/material";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function Pagination() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const page = Number(searchParams.get("reservations")) || 1;

  const pageChange = (_: any, newPage: any) => {
    const params = new URLSearchParams(searchParams);
    params.set("reservations", newPage + 1);
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <TablePagination
      component="div"
      count={0}
      page={page}
      onPageChange={pageChange}
      rowsPerPage={10}
      rowsPerPageOptions={[]}
      onRowsPerPageChange={() => {}}
    />
  );
}
