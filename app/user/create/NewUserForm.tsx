"use client";
import { createUserAccount } from "@/lib/api";
import { Autocomplete, Button, MenuItem, Paper, TextField, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const roles = [
  { id: 1, label: "Admin" },
  { id: 2, label: "Správce" },
  { id: 3, label: "Uživatel" }
]

export default function NewUserForm({
  options,
}: {
  options: any;
}) {
  const {
    register,
    handleSubmit,
    formState: { isValid, isDirty },
    control,
    reset
  } = useForm();
  const { refresh, push } = useRouter()

  const onSubmit = async (data: any) => {
    reset(data)
    createUserAccount({
      ...data,
    }).then(({ success, msg }) => {
      if (success) toast.success("Uživatel úspěšně vytvořen");
      else toast.error(msg || "Něco se nepovedlo");
      push("/user/list")
      refresh()
    });
  };

  return (
    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-2 flex justify-between gap-2">
        <Typography variant="h5">Vytvořit uživatele</Typography>
        <Button
          type="submit"
          variant="outlined"
          size="small"
          disabled={!isValid || !isDirty}
        >
          Uložit
        </Button>
      </div>
      <Paper className="p-2">
        <div className="flex flex-col max-w-[320px] gap-3">
          <TextField
            label="Jméno"
            {...register("first_name", { required: true })}
          />
          <TextField
            label="Příjmení"
            {...register("last_name", { required: true })}
          />
          <TextField
            label="Email"
            {...register("email", {
              required: true,
              pattern: {
                value: /@/,
                message: "Neplatný email",
              },
            })}
          />
          <TextField {...register("role", { required: true })} select label="Role">
            {roles.map((role) => (
              <MenuItem key={role.id} value={role.id}>{role.label}</MenuItem>
            ))}
          </TextField>
          <Controller
            control={control}
            name="parent"
            render={({ field: { value, onChange } }) => (
              <Autocomplete
                value={value}
                onChange={(_, value) => {
                  onChange(value);
                }}
                options={options}
                getOptionLabel={(option: any) => option.name}
                renderOption={(props: any, option: any) => (<li {...props}><span className="w-full flex justify-between"><Typography>{option.name}</Typography><Typography color="text.secondary">{option.email}</Typography></span></li>)}
                renderInput={(params) => (
                  <TextField {...params} label="Rodičovský účet" />
                )}
              />
            )}
          />
        </div>
      </Paper>
    </form>
  );
}
