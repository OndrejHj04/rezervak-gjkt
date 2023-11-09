"use client";

import { store } from "@/store/store";
import { Button, Input, Modal, Paper, Typography } from "@mui/material";
import { useForm } from "react-hook-form";

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
    formState: { isValid },
    handleSubmit,
    watch,
  } = useForm();

  const onSubmit = (data: any) => {
    console.log(data.file);
  };

  return (
    <Modal
      open={true}
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
