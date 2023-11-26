"use client";
import { TablePagination } from "@mui/material";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function UsersPagination({ count }: { count: any }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const page = Number(searchParams.get("users")) || 1;

  const pageChange = (_: any, newPage: any) => {
    const params = new URLSearchParams(searchParams);
    params.set("users", newPage + 1);
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <TablePagination
      component="div"
      count={count}
      page={page - 1}
      onPageChange={pageChange}
      rowsPerPage={5}
      rowsPerPageOptions={[]}
      onRowsPerPageChange={() => {}}
    />
  );
}
