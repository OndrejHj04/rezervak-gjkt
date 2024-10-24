"use client";
import { TablePagination } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function TableListPagination({
  count,
  name,
  rpp,
}: {
  count: number;
  name: any;
  rpp: any;
}) {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get(name)) || 1;
  const { replace } = useRouter();
  const pathname = usePathname();

  const pageChange = (_: any, newPage: any) => {
    const params = new URLSearchParams(searchParams);
    params.set(name, newPage + 1);
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <TablePagination
      className="[&_.MuiToolbar-root]:!min-h-[40px]"
      component="div"
      count={count}
      page={page - 1}
      labelRowsPerPage={"dat"}
      onPageChange={pageChange}
      rowsPerPage={rpp}
      rowsPerPageOptions={[]}
      onRowsPerPageChange={() => { }}
    />
  );
}
