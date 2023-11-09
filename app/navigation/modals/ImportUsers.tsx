"use client";

import { store } from "@/store/store";
import { Modal, Paper, Typography } from "@mui/material";

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

  return (
    <Modal
      open={modal === "importUsers"}
      onClose={close}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Paper sx={style} className="p-2 flex gap-2 flex-col">
        <Typography variant="h5" className="text-center">
          Importovat uživatele
        </Typography>
      </Paper>
    </Modal>
  );
}
