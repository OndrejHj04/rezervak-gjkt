"use client";
import {
  Button,
  Checkbox,
  FormControlLabel,
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
import { verifyUser } from "@/lib/api";
import dayjs from "dayjs";
import * as isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import Link from "next/link";
dayjs.extend(isSameOrBefore as any);

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
  const [checkbox, setCheckbox] = useState(false);

  const underFifteen = (methods.watch("birth_date") &&
    dayjs()
      .subtract(15, "years")
      .isSameOrBefore(dayjs(methods.watch("birth_date")))) as any;

  const onSubmit = (data: verifyForm) => {
    setLoading(true);
    const body = {
      ID_code: data.ID_code,
      birth_date: data.birth_date,
      adress: `${data.street}, ${data.town}, ${data.post_number}`,
      password: data.password,
      newPassword: data.newPassword,
    } as any;
    verifyUser({ ...body, id: id }).then(({ success, email }) => {
      if (success) {
        signIn("credentials", {
          password: data.newPassword,
          email,
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
            <DateInput />
            <TextField
              disabled={!methods.watch("birth_date") || underFifteen}
              {...methods.register("ID_code", {
                required: underFifteen ? false : "Toto pole je povinné",
                pattern: {
                  value: /^\d{9}$/,
                  message: "Číslo OP musí být ve správném formátu",
                },
              })}
              className="w-full"
              style={{ margin: "8px 0 0 0" }}
              helperText="Pro děti do 15 let nepovinné"
              error={!!errors.ID_code}
              label="Číslo OP"
              autoComplete="off"
            />
          </div>
          <div className="flex gap-2 md:flex-row flex-col">
            <TextField
              label="Ulice a ČP"
              {...methods.register("street", {
                required: "Toto pole je povinné",
              })}
              error={!!errors.street}
              className="w-full"
              helperText={errors.street?.message}
            />
            <TextField
              label="Město"
              {...methods.register("town", {
                required: "Toto pole je povinné",
              })}
              className="w-full"
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
              className="w-full"
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
          <FormControlLabel
            control={
              <Checkbox
                onChange={() => setCheckbox((c) => !c)}
                checked={checkbox}
              />
            }
            label={
              <Typography variant="caption">
                Seznámil jsem se s <Link href="/podminky.pdf">podmínkami zpracování osobních údajů</Link> a
                uděluji k tomu organizaci ZO Gymnázium J. K. Tyla souhlas
              </Typography>
            }
          />
          <Button
            disabled={loading || !methods.formState.isValid || !checkbox}
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
