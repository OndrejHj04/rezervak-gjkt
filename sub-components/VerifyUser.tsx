"use client";
import {
  Button,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import RunningWithErrorsIcon from "@mui/icons-material/RunningWithErrors";
import { FormProvider, useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import DateInput from "./DateInput";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState } from "react";
import fetcher from "@/lib/fetcher";
import { method } from "lodash";

export interface verifyForm {
  ID_code: string;
  birth_date: string;
  street: string;
  town: string;
  post_number: string;
  password: string;
  newPassword: string;
}

export default function VerifyUser({ id }: { id?: number }) {
  const methods = useForm<verifyForm>();
  const [hidePassword, setHidePassword] = useState(true);
  const errors = methods.formState.errors;
  const [loading, setLoading] = useState(false);

  const onSubmit = (data: verifyForm) => {
    setLoading(true);
    const body = {
      ID_code: data.ID_code,
      birth_date: data.birth_date,
      adress: `${data.street}, ${data.town}, ${data.post_number}`,
      password: data.password,
      newPassword: data.newPassword,
    };

    fetcher(`/api/account/verify/${id}`, {
      method: "POST",
      body: JSON.stringify(body),
    }).then((res) => {
      if (res.success) {
        signIn("credentials", {
          password: data.newPassword,
          email: res.data.email,
        });
      } else {
        methods.setError("password", { message: "Nesprávné heslo" });
        setLoading(false);
      }
    });
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
          <div className="flex gap-2 md:flex-row flex-col">
            <TextField
              {...methods.register("ID_code", {
                required: "Toto pole je povinné",
                pattern: {
                  value: /^(\d{6})\/(\d{4})$/,
                  message: "RČ musí být ve správném formátu",
                },
              })}
              className="w-full"
              style={{ margin: "8px 0 0 0" }}
              error={!!errors.ID_code}
              helperText={errors.ID_code?.message}
              label="Rodné číslo"
              autoComplete="off"
            />

            <DateInput />
          </div>
          <div className="flex gap-2 md:flex-row flex-col">
            <TextField
              label="Ulice a ČP"
              {...methods.register("street", {
                required: "Toto pole je povinné",
              })}
              error={!!errors.street}
              helperText={errors.street?.message}
            />
            <TextField
              label="Město"
              {...methods.register("town", {
                required: "Toto pole je povinné",
              })}
              error={!!errors.town}
              helperText={errors.town?.message}
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
              label="PSČ (bez mezer)"
              autoComplete="postal-code"
            />
          </div>
          <div className="flex gap-2 md:flex-row flex-col">
            <TextField
              label="Současné heslo"
              className="w-full"
              {...methods.register("password", {
                required: "Toto pole je povinné",
                pattern: {
                  value: /^.{6,}$/,
                  message: "Heslo musí mít alespoň 6 znaků",
                },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
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
              className="w-full"
              {...methods.register("newPassword", {
                required: "Toto pole je povinné",
                pattern: {
                  value: /^.{6,}$/,
                  message: "Heslo musí mít alespoň 6 znaků",
                },
              })}
              error={!!errors.newPassword}
              helperText={errors.newPassword?.message}
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

          <Button
            disabled={loading || !methods.formState.isValid}
            variant="contained"
            type="submit"
          >
            Odeslat
          </Button>
        </form>
      </FormProvider>
    </Paper>
  );
}
