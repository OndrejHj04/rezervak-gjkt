"use client";

import { store } from "@/store/store";
import { Button, Input, Modal, Paper, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import Papa from "papaparse";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { parse } from "path";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  outline: "none",
  transform: "translate(-50%, -50%)",
};

const importUsersValidFormat = ["first_name", "last_name", "email", "role"];

export default function ImportUsers() {
  const [status, setStatus] = useState({ valid: false, message: "" });
  const { modal, setModal } = store();
  const close = () => setModal("");
  const {
    register,
    reset,
    formState: { isValid },
    handleSubmit,
    watch,
  } = useForm();
  const input = watch("file");

  useEffect(() => {
    if (input && input.length) {
      validateFile(input).then((res) => {
        if (res.titleRowFormat && res.validRows.length) {
          setStatus({
            valid: true,
            message: `Data v souboru jsou ve správném formátu. Je zde ${res.validRows.length} platných řádků k nahrání.`,
          });
        } else {
          setStatus({
            valid: false,
            message: `Data v souboru nejsou ve správném formátu. Soubor musí respektovat následující formát: ${importUsersValidFormat.join(
              ","
            )}.`,
          });
        }
      });
    } else {
      setStatus({
        valid: false,
        message: ``,
      });
    }
  }, [input]);

  const makeParse = async (data: any) => {
    return (await new Promise((resolve) => {
      Papa.parse(data[0], {
        encoding: "UTF-8",
        complete: (results: any) => resolve(results.data),
      });
    })) as any;
  };

  const validateFile = async (data: any) => {
    const format = await makeParse(data);

    const titleRowFormat =
      JSON.stringify(format[0]) === JSON.stringify(importUsersValidFormat);
    const validRows = format
      .slice(1)
      .filter(
        (row: any) => row.length === 4 && row.every((item: any) => item.length)
      );

    return { titleRowFormat, validRows };
  };

  const onSubmit = async (data: any) => {
    const { validRows } = (await validateFile(data.file)) as any;

    const newData = validRows.map((row: any) => {
      let object = {} as any;
      row.forEach((item: any, i: any) => {
        object[importUsersValidFormat[i]] = item;
      });
      return object;
    });

    handleRequest(newData);
  };

  const handleRequest = (newData: any) => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/import-new`, {
      method: "POST",
      body: JSON.stringify(newData),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          toast.success(res.message);
          reset();
          close();
        } else {
          toast.error(res.message);
        }
      })
      .catch((e) => toast.error(e.message));
  };

  return (
    <Modal
      open={modal === "importUsers"}
      onClose={close}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Paper sx={style} className="p-2 ">
        <form className="flex gap-2 flex-col" onSubmit={handleSubmit(onSubmit)}>
          <Typography variant="h5" className="text-center">
            Importovat uživatele
          </Typography>
          <Button variant="contained" component="label">
            {input && input.length ? input[0].name : "Vybrat soubror"}

            <input
              type="file"
              hidden
              {...register("file", { required: true })}
              accept=".csv"
            />
          </Button>
          {!!status.message.length && (
            <Typography
              color={status.valid ? "success.main" : "error.main"}
              className="font-semibold text-center"
            >
              {status.message}
            </Typography>
          )}
          <Button
            variant="contained"
            type="submit"
            disabled={!isValid || !status.valid}
          >
            Nahrát
          </Button>
        </form>
      </Paper>
    </Modal>
  );
}
