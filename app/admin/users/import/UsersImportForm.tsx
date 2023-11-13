"use client";

import LoadingButton from "@mui/lab/LoadingButton";
import {
  Button,
  Paper,
  Tab,
  Table,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import Papa from "papaparse";
import { set } from "lodash";
import handleExport from "@/app/utils/export/handleExport";

const importUsersValidFormat = [
  { value: "first_name", name: "Jméno" },
  { value: "last_name", name: "Příjmení" },
  { value: "email", name: "Email" },
  { value: "role", name: "Role" },
];

export default function UsersImportForm({ roles }: { roles: any }) {
  const inputRef = useRef(null);
  const [data, setData] = useState([]);
  const [file, setFile] = useState<any>(null);
  const [message, setMessage] = useState("");

  const downloadSample = () => {
    const csv = Papa.unparse({
      fields: importUsersValidFormat.map((item) => item.value),
      data: ["Jan", "Pavel", "email@email.cz", "1"],
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    console.log(csv, blob);
    handleExport(blob, "vzorovy_soubor.csv");
  };

  const clearFile = () => {
    setFile(null);
    if (inputRef.current) (inputRef.current as any).value = null;
    setMessage("");
  };

  useEffect(() => {
    if (file) parseFile(file);
    if (!file) setData([]);
  }, [file]);

  const validateTable = (data: any) => {
    if (
      JSON.stringify(data[0]) ===
      JSON.stringify(importUsersValidFormat.map((item) => item.value))
    ) {
      setData(data.slice(1));
      setMessage("");
    } else {
      setMessage("Špatný formát souboru");
    }
  };

  const parseFile = (data: any) => {
    Papa.parse(data, {
      encoding: "UTF-8",
      complete: (results: any) => validateTable(results.data),
    });
  };

  return (
    <form className="flex flex-col">
      <div className="mb-2 flex justify-between gap-2">
        <Typography variant="h5">Importovat uživatele</Typography>
        <LoadingButton
          type="submit"
          variant="contained"
          disabled={Boolean(!file || message.length)}
        >
          Importovat uživatele
        </LoadingButton>
      </div>
      <Paper className="p-4 flex gap-4 justify-between">
        <div className="flex flex-col gap-2">
          <Table>
            <TableHead>
              <TableRow>
                {importUsersValidFormat.map((item, i) => (
                  <TableCell key={i}>{item.name}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableHead>
              {data.length ? (
                <>
                  {data.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell>{item[0]}</TableCell>
                      <TableCell>{item[1]}</TableCell>
                      <TableCell>{item[2]}</TableCell>
                      <TableCell>
                        {
                          roles.find((role: any) => role.id === Number(item[3]))
                            ?.role_name
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              ) : (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Typography variant="h6">
                      Žádná uživatelé k zobrazení
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableHead>
          </Table>
          {
            <Typography>
              {file ? `Aktuální soubor: ${file?.name}` : "Soubor nevybrán"}
            </Typography>
          }
          {!!message.length && <Typography color="error">{message}</Typography>}
        </div>

        <div className="flex flex-col gap-2">
          <Button variant="contained" component="label">
            Vybrat soubor
            <input
              type="file"
              ref={inputRef}
              hidden
              accept=".csv"
              onChange={(e: any) => setFile(e.target.files[0])}
            />
          </Button>
          <Button variant="contained" onClick={downloadSample}>
            Stáhnout vzorový soubor
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={clearFile}
            disabled={!file}
          >
            Odstranit soubor
          </Button>
        </div>
      </Paper>
    </form>
  );
}
