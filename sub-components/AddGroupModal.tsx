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

export default function AddGroupModal() {
  const { modal, setModal } = store();
  const { register, handleSubmit, setValue, reset } = useForm();
  const [accounts, setAccounts] = useState<User[] | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/list?roles=1,2,3`)
      .then((res) => res.json())
      .then((data) => setAccounts(data.data));
  }, []);

  const close = () => setModal("");

  const onSubmit = (data: any) => {

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/group/create`, {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(() => toast.success(`Skupina ${data.name} vytvořena`))
      .catch(() => toast.error("Něco se nepovedlo"));
  };

  return (
    <Modal
      open={true}
      onClose={close}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Paper sx={style} className="p-2 flex gap-2 flex-col">
        <Typography variant="h5" className="text-center">
          Vytvořit skupinu
        </Typography>
        <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            variant="outlined"
            label="Název skupiny"
            {...register("name")}
          />
          <TextField
            multiline
            label="Popis"
            minRows={2}
            maxRows={10}
            {...register("description")}
          />

          {accounts && (
            <Autocomplete
              disablePortal
              {...register("owner")}
              onChange={(e, value) => setValue("owner", value?.value)}
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
                <TextField {...params} label="Správce skupiny" />
              )}
            />
          )}
          <Button variant="outlined" type="submit">
            Vytvořit
          </Button>
        </form>
      </Paper>
    </Modal>
  );
}
