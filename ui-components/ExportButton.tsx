"use client";
import * as XLSX from "xlsx";
import handleExport from "@/lib/handleExport";
import { Button } from "@mui/material";

function s2ab(s: any) {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
  return buf;
}

export default function ExportButton({
  prop,
  translate,
}: {
  prop: any;
  translate: any;
}) {
  const makeExport = async () => {
    const req = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/${prop}/export`
    );
    const { data } = await req.json();

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
    const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });

    handleExport(blob, translate + ".xlsx");
  };

  return (
    <Button variant="outlined" onClick={makeExport}>
      Export
    </Button>
  );
}
