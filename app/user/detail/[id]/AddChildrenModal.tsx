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
import { getUserList, userAddChildren } from "@/lib/api";
import UserCard from "../UserCard";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  outline: "none",
  transform: "translate(-50%, -50%)",
};

export default function AddChildrenModal({
  currentChildren,
  userId,
  setModal,
}: {
  currentChildren: any;
  userId: any;
  setModal: any;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { isValid },
  } = useForm();

  const [children, setChildren] = useState(null);

  useEffect(() => {
    getUserList({ withChildrenCollapsed: true }).then((res) =>
      setChildren(res.data)
    );
  }, []);

  const onSubmit = (data: any) => {
    console.log(data);
    userAddChildren({
      user: userId,
      children: data.children.map((group: any) => group.id),
    }).then(({ success }) => {
      success && toast.success("Dětské účty úspěšně přidány");
      !success && toast.error("Něco se nepovedlo");
    });

    MakeUserDetailRefetch(userId);
    setModal(false);
  };
  console.log(children, currentChildren);
  return (
    <Paper sx={style} className="p-2">
      <Typography variant="h5" className="mb-2 text-center">
        Přidat dětské účty
      </Typography>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
        {children ? (
          <Controller
            control={control}
            {...register("children", { required: true })}
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
                  currentChildren.includes(option.id)
                }
                getOptionLabel={(option: any) =>
                  `${option.first_name} ${option.last_name}`
                }
                renderOption={(props: any, option: any) => (
                  <UserCard {...props} user={option} />
                )}
                options={children}
                renderInput={(params) => (
                  <TextField {...params} label="Vybrat účty..." />
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
