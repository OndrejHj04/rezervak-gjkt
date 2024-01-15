"use client";

import AvatarWrapper from "@/ui-components/AvatarWrapper";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import MakeGroupDetailRefetch from "./refetch";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  outline: "none",
  transform: "translate(-50%, -50%)",
};

export default function AddUsersToGroupModal({
  setModal,
  currentUsers,
  group,
}: {
  setModal: Dispatch<SetStateAction<boolean>>;
  currentUsers: number[];
  group: any;
}) {
  const [users, setUsers] = useState(null);
  const {
    handleSubmit,
    control,
    register,
    formState: { isValid },
  } = useForm();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/list`)
      .then((res) => res.json())
      .then((res) => setUsers(res.data));
  }, []);

  const onSubmit = (data: any) => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/group/add-member`, {
      method: "POST",
      body: JSON.stringify({
        group: group.id,
        newMembers: data.users.map((group: any) => group.id),
      }),
    })
      .then((req) => req.json())
      .then((res) => {
        if (res.success) toast.success("Skupiny úspěšně přidány");
        else toast.error("Něco se nepovedlo");
      });

    setModal(false);
    MakeGroupDetailRefetch(group.id);
  };

  return (
    <Paper sx={style} className="p-2 ">
      <Typography variant="h5" className="mb-2 text-center">
        Přidat uživatele
      </Typography>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
        {users ? (
          <Controller
            control={control}
            {...register("users", { required: true })}
            render={({ field: { value, onChange } }) => (
              <Autocomplete
                value={value}
                onChange={(e, value) => {
                  onChange(value);
                }}
                sx={{ width: 300 }}
                multiple
                filterSelectedOptions
                getOptionLabel={(option: any) =>
                  `${option.first_name} ${option.last_name}`
                }
                getOptionDisabled={(option: any) =>
                  currentUsers.includes(option.id)
                }
                options={users}
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
