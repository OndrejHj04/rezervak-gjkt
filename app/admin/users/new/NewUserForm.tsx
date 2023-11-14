"use client";
import MakeUserListRefetch from "@/app/user/list/refetch";
import LoadingButton from "@mui/lab/LoadingButton";
import { Autocomplete, Paper, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function NewUserForm({ roles }: { roles: any }) {
  const { register, setValue, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/new`, {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        toast.success("Uživatel úspěšně vytvořen");
        MakeUserListRefetch();
      })
      .catch((e) => toast.error("Něco se nepovedlo"));
  };

  return (
    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-2 flex justify-between gap-2">
        <Typography variant="h5">Vytvořit uživatele</Typography>
        <LoadingButton type="submit" variant="contained">
          Přidat uživatele
        </LoadingButton>
      </div>
      <Paper className="p-4 flex gap-2">
        <TextField label="Jméno" {...register("first_name")} />
        <TextField label="Příjmení" {...register("last_name")} />
        <TextField label="Email" {...register("email")} />
        <Autocomplete
          sx={{ width: 223 }}
          disablePortal
          {...register("role")}
          onChange={(e, value: any) => setValue("role", value?.value)}
          id="combo-box-demo"
          options={roles.map((role: any) => ({
            label: role.role_name,
            value: role.id,
          }))}
          renderInput={(params) => <TextField {...params} label="Role" />}
        />
      </Paper>
    </form>
  );
}
