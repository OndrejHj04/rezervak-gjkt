"use client";
import { Autocomplete, Box, Paper, TextField, Typography } from "@mui/material";
import AvatarWrapper from "@/ui-components/AvatarWrapper";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import { toast } from "react-toastify";
import MakeGroupDetailRefetch from "@/app/group/detail/[id]/refetch";

export default function GroupNewForm({
  users,
  user,
}: {
  users: any;
  user: any;
}) {
  const { register, handleSubmit, setValue, control, watch } = useForm();
  const [loading, setLoading] = useState(true);
  const owner = watch("owner");

  const onSubmit = (formData: any) => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/group/create`, {
      method: "POST",
      body: JSON.stringify({ ...formData, owner: formData.owner.id }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          toast.success(`Skupina ${res.data.name} byla vytvořena`);
          MakeGroupDetailRefetch(res.data.newGroupId);
        } else {
          toast.error("Něco se pokazilo");
          setLoading(false);
        }
      });
  };

  useEffect(() => {
    if (user) {
      setValue(
        "owner",
        users.find((u: any) => u.id === user.id)
      );
      setLoading(false);
    }
  }, [user]);

  return (
    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-2 flex justify-between gap-2">
        <Typography variant="h5">Nová skupina</Typography>
        <LoadingButton type="submit" variant="contained" loading={loading}>
          Uložit
        </LoadingButton>
      </div>
      <Paper className="p-4 flex flex-col gap-4">
        <div className="flex gap-2">
          <TextField label="Název skupiny" {...register("name")} />
          <TextField label="Popis" {...register("description")} />
          {Boolean(owner || !loading) && (
            <Controller
              control={control}
              {...register("owner")}
              render={({ field: { value, onChange } }) => (
                <Autocomplete
                  sx={{ width: 223 }}
                  value={value}
                  onChange={(e, value) => {
                    onChange(value);
                  }}
                  options={users}
                  getOptionLabel={(option: any) =>
                    `${option.first_name} ${option.last_name}`
                  }
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
                  renderInput={(params) => (
                    <TextField {...params} label="Vybrat uživatele..." />
                  )}
                />
              )}
            />
          )}
        </div>
      </Paper>
    </form>
  );
}
