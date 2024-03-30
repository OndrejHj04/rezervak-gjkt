"use client";

import AvatarWrapper from "@/ui-components/AvatarWrapper";
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
import MakeGroupDetailRefetch from "./refetch";
import UserCard from "@/app/user/detail/UserCard";
import { getUserList, groupAddMembers } from "@/lib/api";

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
    getUserList().then((res) => setUsers(res.data));
  }, []);

  const onSubmit = (data: any) => {
    groupAddMembers({
      group: group.id,
      newMembers: data.users.map((group: any) => group.id),
    }).then(({ success }) => {
      success && toast.success("Uživatelé úspěšně přidáni");
      !success && toast.error("Něco se nepovedlo");
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
                  <UserCard {...props} user={option} />
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
