import MakeRefetch from "@/app/user/list/refetch";
import { store } from "@/store/store";
import AvatarWrapper from "@/ui-components/AvatarWrapper";
import {
  Autocomplete,
  Box,
  Button,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { User as NextAuthUser } from "next-auth";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface User extends NextAuthUser {
  full_name: string;
}
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  outline: "none",
  transform: "translate(-50%, -50%)",
};

export default function AddUserModal() {
  const { register, handleSubmit, setValue, reset } = useForm();
  const { roles, modal, setModal } = store();
  const [accounts, setAccounts] = useState<User[] | null>(null);
  const close = () => setModal("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/list?roles=1,2,3`)
      .then((res) => res.json())
      .then((data) => setAccounts(data.data));
  }, []);

  const onSubmit = (data: any) => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/new`, {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(({ message }) => toast.info(message))
      .catch((e) => toast.error("Something went wrong"))
      .finally(() => {
        MakeRefetch();
      });
    close();
    reset();
  };

  return (
    <Modal
      open={modal === "addUser"}
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
          {accounts && (
            <Autocomplete
              disablePortal
              {...register("parent")}
              onChange={(e, value) => setValue("parent", value?.value)}
              id="combo-box-demo"
              renderOption={(props: any, option: any) => (
                <div {...props}>
                  <Box className="flex items-center gap-2">
                    <AvatarWrapper data={option} />
                    <Typography className="ml-2">
                      {option.first_name} {option.last_name}
                    </Typography>
                  </Box>
                </div>
              )}
              options={accounts.map((acc) => ({
                label: acc.full_name,
                value: acc.id,
                image: acc.image,
                first_name: acc.first_name,
                last_name: acc.last_name,
              }))}
              renderInput={(params) => (
                <TextField {...params} label="Rodičovský účet" />
              )}
            />
          )}
          <Button variant="outlined" type="submit">
            Přidat
          </Button>
        </form>
      </Paper>
    </Modal>
  );
}
