import { store } from "@/store/store";
import {
  Autocomplete,
  Box,
  Button,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

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
  const { register, handleSubmit, setValue } = useForm();
  const { roles } = store();
  const close = () => setModal("");

  const onSubmit = (data: any) => {
    fetch("http://localhost:3000/api/users/new", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(({ message }) => toast.info(message))
      .catch((e) => toast.error("Something went wrong"));
    close();
  };

  return (
    <Modal
      open={true}
      onClose={close}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Paper sx={style} className="p-2">
        <Typography variant="h4">Přidat uživatele</Typography>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <TextField label="Jméno" {...register("first_name")} />
          <TextField label="Příjmení" {...register("last_name")} />
          <TextField label="Email" {...register("email")} />
          <Autocomplete
            disablePortal
            {...register("role")}
            onChange={(e, value) => setValue("role", value?.value)}
            id="combo-box-demo"
            options={roles.map((role) => ({
              label: role.role_name,
              value: role.id,
            }))}
            renderInput={(params) => <TextField {...params} label="Role" />}
          />
          <Button variant="outlined" type="submit">
            Přidat
          </Button>
        </form>
      </Paper>
    </Modal>
  );
}
