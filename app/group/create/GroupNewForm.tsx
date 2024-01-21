"use client";
import {
  Autocomplete,
  Box,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import AvatarWrapper from "@/ui-components/AvatarWrapper";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import { toast } from "react-toastify";
import MakeGroupDetailRefetch from "@/app/group/detail/[id]/refetch";
import fetcher from "@/lib/fetcher";
import { rolesConfig } from "@/rolesConfig";

export default function GroupNewForm({
  users,
  user,
}: {
  users: any;
  user: any;
}) {
  const { register, handleSubmit, setValue, control, watch } = useForm();

  const onSubmit = (formData: any) => {
    fetcher(`/api/group/create`, {
      method: "POST",
      body: JSON.stringify({ ...formData, owner: formData.owner.id }),
    }).then((res) => {
      if (res.success) {
        toast.success(`Skupina ${res.data.name} byla vytvořena`);
        MakeGroupDetailRefetch(res.data.newGroupId, 1);
      } else {
        toast.error("Něco se pokazilo");
      }
    });
  };

  useEffect(() => {
    if (user) {
      setValue(
        "owner",
        users.find((u: any) => u.id === user.id)
      );
    }
  }, [user]);

  return (
    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-2 flex justify-between gap-2">
        <Typography variant="h5">Nová skupina</Typography>
        <LoadingButton type="submit" variant="contained">
          Uložit
        </LoadingButton>
      </div>
      <Paper className="p-4 flex flex-col gap-4">
        <div className="flex gap-2">
          <TextField label="Název skupiny" {...register("name")} />
          <TextField label="Popis" {...register("description")} />
          <Controller
            control={control}
            {...register("owner")}
            render={({ field: { value, onChange } }) => (
              <Autocomplete
                sx={{ width: 223 }}
                value={value}
                defaultValue={user}
                disabled={
                  !rolesConfig.groups.modules.groupsCreate.select[
                    user.role.id as never
                  ]
                }
                onChange={(e, value) => {
                  onChange(value);
                }}
                options={users}
                getOptionLabel={(option: any) =>
                  `${option.first_name} ${option.last_name}`
                }
                renderOption={(props: any, option: any) => (
                  <ListItem disablePadding key={option.id} {...props}>
                    <ListItemIcon>
                      <AvatarWrapper data={option} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography>
                          {option.first_name} {option.last_name}
                        </Typography>
                      }
                      secondary={option.email}
                    />
                  </ListItem>
                )}
                renderInput={(params) => (
                  <TextField {...params} label="Majitel skupiny" />
                )}
              />
            )}
          />
        </div>
      </Paper>
    </form>
  );
}
