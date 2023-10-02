"use client";
import { store } from "@/store/store";
import DateDefaultInput from "@/sub-components/DateDefaultInput";
import AvatarWrapper from "@/ui-components/AvatarWrapper";
import {
  Avatar,
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { User } from "next-auth";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import NoAccountsIcon from "@mui/icons-material/NoAccounts";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  outline: "none",
  transform: "translate(-50%, -50%)",
};

export default function UserDetailForm({ id }: { id: string }) {
  const { roles } = store();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [sleep, setSleep] = useState(false);
  const fetchUser = async () => {
    fetch(`http://localhost:3000/api/users/detail/${id}`)
      .then((res) => res.json())
      .then(({ data }) => {
        setUser(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const methods = useForm<User>();

  const {
    register,
    handleSubmit,
    formState: { dirtyFields, isDirty },
  } = methods;

  const onSubmit = (data: any) => {
    const body: any = {};
    Object.keys(dirtyFields).forEach((key: string) => {
      body[key] = data[key];
    });

    fetch(`http://localhost:3000/api/users/edit/${id}`, {
      body: JSON.stringify(body),
      method: "POST",
    })
      .then((res) => res.json())
      .then(({ data }) => {
        setUser(data);
        toast.success("Uživatel byl upraven");
      });
  };

  const makeUserSleep = () => {
    fetch(`http://localhost:3000/api/users/edit/${user?.id}`, {
      body: JSON.stringify({ active: false }),
      method: "POST",
    })
      .then((res) => res.json())
      .then(({ data }) => {
        setSleep(false);
        toast.success(
          `Uživatel ${user?.first_name} ${user?.last_name} byl uspán`
        );
      });
  };

  return (
    <>
      <Modal open={sleep} onClose={() => setSleep(false)}>
        <Paper sx={style} className="p-4 flex flex-col gap-2 max-w-sm">
          <div className="flex items-center justify-between">
            <NoAccountsIcon sx={{ color: "#ED9191", fontSize: 36 }} />
            <Typography variant="h5">Uspat uživatele</Typography>
            <NoAccountsIcon sx={{ color: "#ED9191", fontSize: 36 }} />
          </div>
          <Divider />
          <Box className="flex items-center gap-2">
            <AvatarWrapper data={user!} />
            <Typography variant="h6">
              {user?.first_name} {user?.last_name}
            </Typography>
          </Box>
          <Divider />
          <Typography className="text-justify">
            Uspání uživatele mu znemožňuje jakoukoliv interakci s aplikací. Není
            možné provádět rezervace, ani spravovat svůj účet. Uživateli bude
            administrátor moci kdykoliv znovu přiřadit stav aktivního účtu.
          </Typography>
          <Button color="error" variant="contained" onClick={makeUserSleep}>
            deaktivovat
          </Button>
        </Paper>
      </Modal>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box className="w-full flex items-end gap-2">
            <Box className="ml-auto flex gap-2">
              <Button
                color="error"
                variant="outlined"
                onClick={() => setSleep(true)}
              >
                Uspat uživatele
              </Button>

              <Button variant="contained" type="submit" disabled={!isDirty}>
                Uložit
              </Button>
            </Box>
          </Box>
          {user && (
            <Box className="w-full flex gap-4">
              <Paper className="p-4 flex flex-col gap-2 aspect-square items-center justify-center">
                <AvatarWrapper data={user} />
              </Paper>
              <Paper className="p-4 flex flex-col gap-2">
                <TextField
                  defaultValue={user.first_name}
                  label="Jméno"
                  {...register("first_name")}
                />
                <TextField
                  defaultValue={user.last_name}
                  label="Příjmení"
                  {...register("last_name")}
                />
                <TextField
                  defaultValue={user.email}
                  label="Email"
                  {...register("email")}
                />
              </Paper>
              <Paper className="p-4 flex flex-col gap-2">
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Role</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    defaultValue={user.role.role_id}
                    label="Role"
                    {...register("role")}
                  >
                    {roles.map((role) => (
                      <MenuItem key={role.id} value={role.id}>
                        {role.role_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControlLabel
                  control={
                    <Switch
                      defaultChecked={user.verified}
                      {...register("verified")}
                    />
                  }
                  label="Ověřený účet"
                />
              </Paper>
              <Paper className="p-4 flex flex-col gap-2">
                <TextField
                  defaultValue={user.adress}
                  label="Adresa"
                  {...register("adress")}
                />
                <TextField
                  defaultValue={user.ID_code}
                  label="Číslo OP"
                  {...register("ID_code")}
                />
                <DateDefaultInput birth={user.birth_date} />
              </Paper>
            </Box>
          )}
        </form>
      </FormProvider>
    </>
  );
}
