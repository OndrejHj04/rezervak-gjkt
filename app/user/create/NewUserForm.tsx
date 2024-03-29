"use client";
import MakeUserListRefetch from "@/app/user/list/refetch";
import fetcher from "@/lib/fetcher";
import LoadingButton from "@mui/lab/LoadingButton";
import { Autocomplete, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function NewUserForm({ roles }: { roles: any }) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { isValid },
    control,
  } = useForm();

  const onSubmit = async (data: any) => {
    setLoading(true);
    fetcher(`/api/users/new`, {
      method: "POST",
      body: JSON.stringify({ ...data, role: data.role.value }),
    }).then((res) => {
      if (res.success) {
        toast.success("Uživatel úspěšně vytvořen");
        MakeUserListRefetch("/user/list", 1);
      } else if (res.duplicate) {
        setLoading(false);
        toast.error("Uživatel s tímto emailem už existuje");
      } else {
        setLoading(false);
        toast.error("Něco se nepovedlo");
      }
    });
  };

  return (
    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-2 flex justify-between gap-2">
        <Typography variant="h5">Vytvořit uživatele</Typography>
        <LoadingButton
          type="submit"
          variant="contained"
          loading={loading}
          disabled={!isValid}
        >
          Přidat uživatele
        </LoadingButton>
      </div>
      <Paper className="sm:p-4 p-2 flex md:flex-row flex-col gap-2">
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
        <Controller
          control={control}
          {...register("role", { required: true })}
          render={({ field: { value, onChange } }) => (
            <Autocomplete
              className="md:w-80 w-full"
              disablePortal
              value={value}
              onChange={(_, value) => onChange(value)}
              id="combo-box-demo"
              options={roles.map((role: any) => ({
                label: role.name,
                value: role.id,
              }))}
              renderInput={(params) => <TextField {...params} label="Role" />}
            />
          )}
        />
      </Paper>
    </form>
  );
}
