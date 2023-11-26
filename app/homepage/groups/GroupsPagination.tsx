"use client";
import { TablePagination } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function GroupsPagination({ count }: { count: number }) {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("groups")) || 1;
  const { replace } = useRouter();
  const pathname = usePathname();

  const pageChange = (_: any, newPage: any) => {
    const params = new URLSearchParams(searchParams);
    params.set("groups", newPage + 1);
    replace(`${pathname}?${params.toString()}`);
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
