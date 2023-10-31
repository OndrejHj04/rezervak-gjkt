"use client";

import { Role } from "@/types";
import AvatarWrapper from "@/ui-components/AvatarWrapper";
import {
  Autocomplete,
  Button,
  Chip,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { DateField, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { User } from "next-auth";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import MakeUserDetailRefetch from "./refetch";

export default function UserDetailForm({
  userDetail,
  roles,
}: {
  userDetail: User;
  roles: Role[];
}) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isDirty },
  } = useForm();

  const onSubmit = (data: any) => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/edit/${userDetail.id}`,
      {
        method: "POST",
        body: JSON.stringify({
          ...data,
          role: data.role.id,
        }),
      }
    )
      .then((res) => res.json())
      .then((res) => toast.success("Uživatel byl upraven."))
      .catch((err) => toast.error("Něco se pokazilo."))
      .finally(() => {
        MakeUserDetailRefetch(userDetail.id);
        reset();
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <div className="flex gap-2 ml-auto">
          <Button variant="outlined" color="error">
            Uspat uživatele
          </Button>
          <Button variant="outlined" type="submit" disabled={!isDirty}>
            Uložit
          </Button>
        </div>
        <Paper className="p-4 flex flex-col gap-4">
          <div className="flex gap-2">
            <div className="flex flex-col">
              <div className="flex gap-2">
                <AvatarWrapper size={56} data={userDetail} />
                <div className="flex flex-col">
                  <Typography variant="h6" className="font-semibold">
                    {userDetail.first_name} {userDetail.last_name}
                  </Typography>
                  <Typography>{userDetail.email}</Typography>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Controller
                    control={control}
                    name="birth_date"
                    defaultValue={dayjs(userDetail.birth_date) as any}
                    render={({ field }) => (
                      <DateField
                        {...field}
                        label="Datum narození"
                        format="DD.MM.YYYY"
                      />
                    )}
                  />
                </LocalizationProvider>

                <TextField
                  label="Číslo OP"
                  {...register("ID_code")}
                  defaultValue={userDetail.ID_code}
                />
                <Controller
                  control={control}
                  name="role"
                  defaultValue={userDetail.role}
                  render={({ field: { value, onChange } }) => (
                    <Autocomplete
                      value={value}
                      options={roles}
                      onChange={(e, value) => {
                        onChange(value);
                      }}
                      renderOption={(props: any, option: any) => (
                        <div {...props}>{option.role_name}</div>
                      )}
                      getOptionLabel={(option: any) => option.role_name}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Role"
                          sx={{ width: 223 }}
                        />
                      )}
                    />
                  )}
                />
              </div>
              <TextField
                label="Adresa"
                className="col-span-2"
                {...register("adress")}
                defaultValue={userDetail.adress}
              />
            </div>
          </div>
          <div>*//*</div>
        </Paper>
      </form>
    </>
  );
}
