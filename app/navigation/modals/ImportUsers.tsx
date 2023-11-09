"use client";

import { store } from "@/store/store";
import { Button, Input, Modal, Paper, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import Papa from "papaparse";
import { toast } from "react-toastify";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  outline: "none",
  transform: "translate(-50%, -50%)",
};

export default function ImportUsers() {
  const { modal, setModal } = store();
  const close = () => setModal("");
  const {
    register,
    reset,
    formState: { isValid },
    handleSubmit,
    watch,
  } = useForm();

  const handleRequest = (newData: any) => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/import-new`, {
      method: "POST",
      body: JSON.stringify(newData),
    })
      .then((res) => res.json())
      .then((res) => {
        reset();
        toast.success(res.message);
        close();
      })
      .catch((e) => console.log(e));
  };

  const onSubmit = async (data: any) => {
    const parse = (await new Promise((resolve) => {
      Papa.parse(data.file[0], {
        encoding: "UTF-8",
        complete: (results: any) => resolve(results.data),
      });
    })) as any;
    const planObject = parse[0] as any;
    const filteredRows = parse.filter(
      (row: any) => row.length === planObject.length && row !== planObject
    );
    const newData = filteredRows.map((row: any) => {
      let object = {} as any;
      row.forEach((item: any, i: any) => {
        object[planObject[i]] = item;
      });
      return object;
    });
    handleRequest(newData);
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
            {watch("file") ? watch("file")[0].name : <span>Vybrat soubor</span>}

            <input
              type="file"
              hidden
              {...register("file", { required: true })}
              accept=".csv"
            />
          </Button>
          <Button variant="contained" type="submit" disabled={!isValid}>
            Nahrát
          </Button>
        </form>
      </Paper>
    </Modal>
  );
}
