"use client";

import {
  Autocomplete,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import MakeUserDetailRefetch from "./refetch";
import fetcher from "@/lib/fetcher";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  outline: "none",
  transform: "translate(-50%, -50%)",
};
export default function AddGroupsModal({
  currentGroups,
  userId,
  userEmail,
  setModal,
}: {
  currentGroups: number[];
  userId: number;
  userEmail: any;
  setModal: Dispatch<SetStateAction<boolean>>;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { isValid },
  } = useForm();

  const [groups, setGroups] = useState(null);

  useEffect(() => {
    fetcher(`/api/group/list?limit=true`).then((res) => setGroups(res.data));
  }, []);

  const onSubmit = (data: any) => {
    fetcher(`/api/users/add-groups`, {
      method: "POST",
      body: JSON.stringify({
        user: userId,
        groups: data.groups.map((group: any) => group.id),
      }),
    }).then((res) => {
      if (res.success) toast.success("Skupiny úspěšně přidány");
      else toast.error("Něco se nepovedlo");
    });

    MakeUserDetailRefetch(userId);
    setModal(false);
  };

  return (
    <Paper sx={style} className="p-2">
      <Typography variant="h5" className="mb-2 text-center">
        Přidat skupiny
      </Typography>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
        {groups ? (
          <Controller
            control={control}
            {...register("groups", { required: true })}
            render={({ field: { value, onChange } }) => (
              <Autocomplete
                value={value}
                onChange={(e, value) => {
                  onChange(value);
                }}
                sx={{ width: 300 }}
                multiple
                filterSelectedOptions
                getOptionDisabled={(option: any) =>
                  currentGroups.includes(option.id)
                }
                options={groups}
                getOptionLabel={(option: any) => option.name}
                renderInput={(params) => (
                  <TextField {...params} label="Vybrat skupiny..." />
                )}
              />
            )}
          />
        ) : (
          <CircularProgress />
        )}
        <Button variant="contained" type="submit" disabled={!isValid}>
          Uložit
        </Button>
      </form>
    </Paper>
  );
}
