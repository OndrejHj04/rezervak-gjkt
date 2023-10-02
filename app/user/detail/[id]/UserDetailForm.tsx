"use client";
import { store } from "@/store/store";
import DateDefaultInput from "@/sub-components/DateDefaultInput";
import DateInput from "@/sub-components/DateInput";
import AvatarWrapper from "@/ui-components/AvatarWrapper";
import {
  Avatar,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { User } from "next-auth";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { FormProvider, set, useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function UserDetailForm({ id }: { id: string }) {
  const { roles } = store();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

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

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box className="w-full flex items-end gap-2">
          <Box className="ml-auto flex gap-2">
            <Button color="error" variant="outlined">
              uspat uživatele
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
  );
}
