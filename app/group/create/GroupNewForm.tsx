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
import { rolesConfig } from "@/lib/rolesConfig";
import UserCard from "@/app/user/detail/UserCard";
import { createNewGroup } from "@/lib/api";

export default function GroupNewForm({
  users,
  user,
}: {
  users: any;
  user: any;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { isValid },
  } = useForm();

  const [loading, setLoading] = useState(false);

  const onSubmit = async (formData: any) => {
    setLoading(true);
    createNewGroup({
      ...formData,
      owner: formData.owner.id,
    }).then(({ success, id }) => {
      success && toast.success(`Skupina  úspěšně vytvořena`);
      !success && toast.error("Něco se pokazilo");
      setLoading(false);
      MakeGroupDetailRefetch(id, 1);
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
        <LoadingButton
          type="submit"
          variant="contained"
          disabled={!isValid || loading}
        >
          Uložit
        </LoadingButton>
      </div>
      <Paper className="sm:p-4 p-2 gap-4">
        <div className="flex sm:flex-row flex-col gap-2">
          <TextField
            label="Název skupiny"
            {...register("name", { required: true })}
          />
          <TextField
            label="Popis"
            {...register("description", { required: true })}
          />
          <Controller
            control={control}
            {...register("owner", { required: true })}
            render={({ field: { value, onChange } }) => (
              <Autocomplete
                className="sm:w-80 w-full"
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
                  <UserCard user={option} {...props} />
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
