"use client";
import * as XLSX from "xlsx";
import handleExport from "@/lib/handleExport";
import { Button } from "@mui/material";
import { useSession } from "next-auth/react";

function s2ab(s: any) {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
  return buf;
}

export default function ExportReservationButton({
  prop,
  translate,
  ...rest
}: any) {
  const { data } = useSession()
  const roleId = data?.user.role.id

  const makeExport = async () => {
    const req = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/${prop}/export`
    );
    const { data } = await req.json();

    const wb = XLSX.utils.book_new();

    data.map((reservation: any) => {
      console.log(reservation)
      const ws = XLSX.utils.json_to_sheet([
        {
          id: reservation.id,
          začátek: reservation.from_date,
          konec: reservation.to_date,
          název: reservation.test,
          vedoucí: reservation.leader
        }
      ]);

      XLSX.utils.sheet_add_json(ws, reservation.users, {
        origin: `A4`,
        skipHeader: false,
      });
      XLSX.utils.book_append_sheet(wb, ws, reservation.name.length > 20 ? `${reservation.name.substring(0, 20)}..., id:${reservation.id}` : `${reservation.name}, id:${reservation.id}`);
    })

    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
    const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });

    handleExport(blob, translate + ".xlsx");
  };

  return (
    <Button variant="outlined" onClick={makeExport} disabled={roleId === 3} {...rest}>
      Export
    </Button>
  );
}
