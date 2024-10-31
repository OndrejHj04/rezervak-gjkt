"use client";

import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import Papa from "papaparse";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { toast } from "react-toastify";
import Link from "next/link";
import { importNewUsers, validateImport } from "@/lib/api";
import { useRouter } from "next/navigation";

const importUsersValidFormat = [
  { value: "first_name", name: "Jméno" },
  { value: "last_name", name: "Příjmení" },
  { value: "email", name: "Email" },
  { value: "role", name: "Role" },
];

export default function UsersImportForm({ roles }: { roles: any }) {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const [data, setData] = useState([]);
  const [file, setFile] = useState<any>(null);
  const [message, setMessage] = useState("");

  const { refresh, push } = useRouter()
  const handleSubmit = (e: any) => {
    setLoading(true);
    e.preventDefault();
    const newData = [] as any;
    data.map((item: any) => {
      if (item[4]) {
        let obj = {} as any;
        item.slice(0, item.length - 1).map((i: any, c: any) => {
          obj[importUsersValidFormat[c].value] = i;
        });
        newData.push(obj);
      }
    });
    importNewUsers({ users: newData }).then(({ success, count }) => {
      if (success) toast.success(`${count} uživatelů úspěšně importováno`);
      else toast.error(`Něco se nepovedlo`);
    });
    refresh()
    push("/user/list")
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

  const validateTable = async (data: any) => {
    if (
      JSON.stringify(data[0]) ===
      JSON.stringify(importUsersValidFormat.map((item) => item.value))
    ) {
      validateImport({ data: data.slice(1) }).then(({ data }) => {
        setData(
          data.map((item: any) => {
            return [
              ...item.slice(0, 4),
              item[4] ? validateRow(item.slice(0, 4)) : false,
            ];
          })
        );
      });

      setMessage("");
    } else {
      setMessage("Špatný formát souboru");
    }
  };

  const parseFile = (data: any) => {
    Papa.parse(data, {
      encoding: "Windows-1250",
      complete: (results: any) => validateTable(results.data),
    });
  };

  const validateRow = (data: any) => {
    return (
      data.every((item: any) => item.length) &&
      data.length === 4 &&
      data[2].includes("@")
    );
  };

  return (
    <form className="flex flex-col">
      <div className="mb-2 flex justify-between gap-2">
        <Typography variant="h5">Importovat uživatele</Typography>
        <Button
          type="submit"
          variant="contained"
          onClick={handleSubmit}
          disabled={Boolean(
            !file || message.length || data.every((item) => !item[4]) || loading
          )}
        >
          Importovat uživatele
        </Button>
      </div>
      <Paper className="md:p-4 p-2 flex md:flex-row flex-col gap-4 justify-between">
        <div className="flex flex-col gap-2">
          <Box sx={{ overflow: "auto" }}>
            <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {importUsersValidFormat.map((item, i) => (
                      <TableCell key={i}>{item.name}</TableCell>
                    ))}
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.length ? (
                    <>
                      {data.map((item, i) => {
                        return (
                          <TableRow key={i}>
                            <TableCell>{item[0]}</TableCell>
                            <TableCell>{item[1]}</TableCell>
                            <TableCell>{item[2]}</TableCell>
                            <TableCell>
                              {
                                roles.find(
                                  (role: any) => role.id === Number(item[3])
                                )?.name
                              }
                            </TableCell>
                            <TableCell>
                              {item[4] ? (
                                <CheckCircleIcon color="success" />
                              ) : (
                                <CancelIcon color="error" />
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </>
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <Typography variant="h6">
                          Žádní uživatelé k zobrazení
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          </Box>
          {
            <Typography>
              {file ? `Aktuální soubor: ${file?.name}` : "Soubor nevybrán"}
            </Typography>
          }
          {!!message.length && <Typography color="error">{message}</Typography>}
        </div>

        <div className="flex flex-col gap-2">
          <Button variant="contained" component="label" className="text-center">
            Vybrat soubor .csv
            <input
              type="file"
              ref={inputRef}
              hidden
              accept=".csv"
              onChange={(e: any) => setFile(e.target.files[0])}
            />
          </Button>
          <Link href="/vzorovy_soubor.csv">
            <Button variant="contained">Stáhnout vzorový soubor</Button>
          </Link>
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
