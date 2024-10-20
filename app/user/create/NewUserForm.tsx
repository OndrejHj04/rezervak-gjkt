"use client";
import { createUserAccount } from "@/lib/api";
import LoadingButton from "@mui/lab/LoadingButton";
import { Autocomplete, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import UserCard from "../detail/UserCard";
import { useRouter } from "next/navigation";

export default function NewUserForm({
  roles,
  users,
}: {
  roles: any;
  users: any;
}) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { isValid },
    control,
  } = useForm();
  const { refresh, push } = useRouter()

  const onSubmit = async (data: any) => {
    setLoading(true);
    createUserAccount({
      ...data,
      role: data.role.value,
      parent: data.parent?.id,
    }).then(({ success, msg }) => {
      if (success) {
        toast.success("Uživatel úspěšně vytvořen");
        refresh()
        push("/user/list")
      } else {
        toast.error(msg || "Něco se nepovedlo");
      }
      setLoading(false);
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
        <Controller
          control={control}
          {...register("parent")}
          render={({ field: { value, onChange } }) => (
            <Autocomplete
              sx={{ width: 300 }}
              value={value}
              onChange={(e, value) => {
                onChange(value);
              }}
              filterSelectedOptions
              options={users}
              getOptionLabel={(option: any) =>
                `${option.first_name} ${option.last_name}`
              }
              renderOption={(props: any, option: any) => (
                <UserCard {...props} user={option} />
              )}
              renderInput={(params) => (
                <TextField {...params} label="Rodičovský účet" />
              )}
            />
          )}
        />
      </Paper>
    </form>
  );
}
