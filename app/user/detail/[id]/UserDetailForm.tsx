"use client";
import { store } from "@/store/store";
import AvatarWrapper from "@/ui-components/AvatarWrapper";
import {
  Avatar,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { User } from "next-auth";
import { useEffect, useState } from "react";
import { set, useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function UserDetailForm({ id }: { id: string }) {
  const { roles, user, setUser } = store();
  const {
    register,
    handleSubmit,
    formState: { dirtyFields, isDirty },
  } = useForm<User>();

  const onSubmit = (data: any) => {
    const body: any = {};
    Object.keys(dirtyFields).forEach((key: string) => {
      body[key] = data[key];
    });

    fetch(`http://localhost:3000/api/users/edit/${id}`, {
      body: JSON.stringify(body),
      method: "POST",
    })
      .then((res) => res.json())
      .then(({ data }) => {
        toast.success("Uživatel byl upraven");
        setUser(data);
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box className="w-full flex items-end">
        <Button
          variant="contained"
          style={{ marginLeft: "auto" }}
          type="submit"
          disabled={!isDirty}
        >
          Uložit
        </Button>
      </Box>
      {user && (
        <Box className="w-full flex gap-4">
          <Paper className="p-4 flex flex-col gap-2 aspect-square items-center justify-center">
            <AvatarWrapper />
          </Paper>
          <Paper className="p-4 flex flex-col gap-2">
            <TextField
              defaultValue={user.first_name}
              label="Jméno"
              {...register("first_name")}
            />
            <TextField
              defaultValue={user.last_name}
              label="Příjmení"
              {...register("last_name")}
            />
            <TextField
              defaultValue={user.email}
              label="Email"
              {...register("email")}
            />
          </Paper>
          <Paper className="p-4 flex flex-col gap-2">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Role</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                defaultValue={user.role.role_id}
                label="Role"
                {...register("role")}
              >
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.role_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  defaultChecked={user.verified}
                  {...register("verified")}
                />
              }
              label="Ověřený účet"
            />
          </Paper>
        </Box>
      )}
    </form>
  );
}
