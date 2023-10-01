"use client";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Tooltip,
  Typography,
  createStyles,
  makeStyles,
} from "@mui/material";
import RunningWithErrorsIcon from "@mui/icons-material/RunningWithErrors";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { store } from "@/store/store";
import { signIn, useSession } from "next-auth/react";
import { Session } from "next-auth";
import DateInput from "./DateInput";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useEffect, useState } from "react";
import Cleave from "cleave.js/react";

export interface verifyForm {
  ID_code: string;
  birth_date: string;
  street: string;
  town: string;
  post_number: string;
  password: string;
  newPassword: string;
}

export default function VerifyUser({ id }: { id?: string }) {
  const methods = useForm<verifyForm>({ mode: "onBlur" });
  const { setUser, setUserLoading } = store();
  const [hidePassword, setHidePassword] = useState(true);
  const errors = methods.formState.errors;

  const onSubmit = (data: verifyForm) => {
    // "ID_code": "111111111",
    // "street": "Bezová 148",
    // "town": "sadfasdf",
    // "post_number": "50009",
    // "password": "asfdaaa",
    // "newPassword": "asfdasf",
    // "birth_date": "2023-01-26"

    const body = {
      ID_code: data.ID_code,
      birth_date: data.birth_date,
      adress: `${data.street}, ${data.town}, ${data.post_number}`,
      password: data.password,
      newPassword: data.newPassword,
    };
    // setUserLoading(false);
    // fetch(`http://localhost:3000/api/account/verify/${id}`, {
    //   method: "POST",
    //   body: JSON.stringify(body),
    // })
    //   .then((res) => res.json())
    //   .then((data) => console.log(data))
    //   .catch((e) => console.log(e));
    // .then((res) => {
    //   signIn("credentials", {
    //     password: data.newPassword,
    //     email: res.data.email,
    //   });
    // });
  };

  return (
    <Paper className="p-2">
      <div className="flex justify-between">
        <RunningWithErrorsIcon sx={{ color: "#ED9191" }} />
        <Typography variant="h5">Ověření účtu</Typography>
        <RunningWithErrorsIcon sx={{ color: "#ED9191" }} />
      </div>
      <Typography variant="body2" sx={{ textAlign: "center" }}>
        Je potřeba doplnit několik informací než budete moci pokračovat
      </Typography>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="flex flex-col gap-2"
        >
          <div className="flex gap-2">
            <TextField
              {...methods.register("ID_code", {
                required: "Toto pole je povinné",
                pattern: {
                  value: /^\d{9}$/,
                  message: "Číslo OP musí mít 9 číslic",
                },
              })}
              error={!!errors.ID_code}
              helperText={errors.ID_code?.message}
              label="Číslo OP"
              sx={{ width: 215, marginTop: 1 }}
            />
            <DateInput />
          </div>
          <div className="flex gap-2">
            <TextField
              label="Ulice a ČP"
              {...methods.register("street", {
                required: "Toto pole je povinné",
              })}
              error={!!errors.street}
              helperText={errors.street?.message}
              sx={{ width: 130 }}
            />
            <TextField
              label="Město"
              {...methods.register("town", {
                required: "Toto pole je povinné",
              })}
              error={!!errors.town}
              helperText={errors.town?.message}
              sx={{ width: 160 }}
            />

            <TextField
              {...methods.register("post_number", {
                required: "Toto pole je povinné",
                pattern: {
                  value: /^\d{5}$/,
                  message: "PSČ musí mít 5 číslic",
                },
              })}
              error={!!errors.post_number}
              helperText={errors.post_number?.message}
              label="PSČ"
              sx={{ width: 130 }}
            />
          </div>

          <div className="flex gap-2">
            <TextField
              label="Současné heslo"
              {...methods.register("password", {
                required: "Toto pole je povinné",
                pattern: {
                  value: /^.{6,}$/,
                  message: "Heslo musí mít alespoň 6 znaků",
                },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              sx={{ width: 215 }}
              type={hidePassword ? "password" : "text"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setHidePassword((c) => !c)}
                      edge="end"
                    >
                      {hidePassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Nové heslo"
              {...methods.register("newPassword", {
                required: "Toto pole je povinné",
                pattern: {
                  value: /^.{6,}$/,
                  message: "Heslo musí mít alespoň 6 znaků",
                },
              })}
              error={!!errors.newPassword}
              helperText={errors.newPassword?.message}
              sx={{ width: 215 }}
              type={hidePassword ? "password" : "text"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setHidePassword((c) => !c)}
                      edge="end"
                    >
                      {hidePassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>

          <Button variant="contained" type="submit" className="w-full">
            Odeslat
          </Button>
        </form>
      </FormProvider>
    </Paper>
  );
}
