"use client"

import { ArrowDropDown, ArrowDropUp, SwapVert } from "@mui/icons-material"
import { TableCell, TableCellProps } from "@mui/material"
import { usePathname, useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
type ExtendedTableCellProps = TableCellProps & {
  name: string
}


export default function SortableCell(props: ExtendedTableCellProps) {
  const { children, name, ...rest } = props
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort")
  const direction = searchParams.get("direction")
  const pathname = usePathname();
  const { replace } = useRouter();

  const makeSort = () => {
    const params = new URLSearchParams(searchParams);
    if (direction === "asc") {
      params.delete("sort")
      params.delete("direction")
    } else if (direction === "desc") {
      params.set("sort", name);
      params.set("direction", "asc");
    } else {
      params.set("sort", name);
      params.set("direction", "desc");
    }

    replace(`${pathname}?${params.toString()}`);
  };

  let icon = <ArrowDropUp className="absolute" />
  if (direction === "asc") icon = <ArrowDropDown className="absolute" />

  return <TableCell {...rest} onClick={() => makeSort()}>
    {children}
    {sort === name ? icon : <SwapVert className="absolute opacity-30" />}
  </TableCell>
}
