import {
  Autocomplete,
  Box,
  Button,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  outline: "none",
  transform: "translate(-50%, -50%)",
};

export default function AddUserModal({
  setModal,
}: {
  setModal: (string: string) => void;
}) {
  return (
    <Modal
      open={true}
      onClose={() => setModal("")}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Paper sx={style} className="p-2">
        <Typography variant="h4">Přidat uživatele</Typography>
        <Box className="flex flex-col gap-2">
          <TextField label="Jméno" />
          <TextField label="Příjmení" />
          <TextField label="Email" />
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={[{ label: "The Shawshank Redemption", year: 1994 }]}
            renderInput={(params) => <TextField {...params} label="Role" />}
          />
          <Button variant="outlined">Přidat</Button>
        </Box>
      </Paper>
    </Modal>
  );
}
