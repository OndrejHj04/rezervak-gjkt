"use client";
import {
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState } from "react";
import { verifyUser } from "@/lib/api";
import dayjs from "dayjs";
import * as isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import Link from "next/link";
import { DatePicker } from "@mui/x-date-pickers";
dayjs.extend(isSameOrBefore as any);

export default function VerifyUser({ id }: { id?: number }) {
  const { watch, reset, setError, register, handleSubmit, control, formState: { errors, isValid, isDirty } } = useForm({
    defaultValues: {
      conditions: false,
      birth_date: null,
      ID_code: "",
      town: "",
      post_number: "",
      street: "",
      password: "",
      newPassword: ""
    }
  });
  const [hidePassword, setHidePassword] = useState(true);

  const underFifteen = (watch("birth_date") &&
    dayjs()
      .subtract(15, "years")
      .isSameOrBefore(dayjs(watch("birth_date")))) as any;

  const onSubmit = (data: any) => {
    reset(data)
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
          email
        });
      } else {
        setError("password", { message: "Nesprávné heslo" });
      }
    });
  };

  return (
    <Paper className="p-2 flex flex-col gap-2">
      <div>
        <Typography variant="h5" className="text-center">Ověření účtu</Typography>
        <Typography className="text-center">
          Je potřeba doplnit několik informací než budete moci pokračovat
        </Typography>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex gap-2">
          <Controller
            name="birth_date"
            control={control}
            render={({ field }) => (
              <DatePicker {...field} label="Datum narození" format="DD. MM. YYYY" disableFuture className="w-full" />
            )}
          />
          <TextField
            disabled={!watch("birth_date") || underFifteen}
            fullWidth
            {...register("ID_code", {
              required: !underFifteen,
              pattern: {
                value: /^\d{9}$/,
                message: "Číslo OP musí být ve správném formátu",
              },
            })}
            helperText={errors.ID_code?.message || "Pro děti do 15 let nepovinné"}
            error={!!errors.ID_code}
            label="Číslo OP"
            autoComplete="off"
          />
        </div>
        <div className="flex gap-2 mt-2">
          <TextField
            fullWidth
            label="Ulice a ČP"
            {...register("street", {
              required: "Toto pole je povinné",
            })}
          />
          <TextField
            fullWidth
            label="Město"
            {...register("town", {
              required: "Toto pole je povinné",
            })}
          />
          <TextField
            fullWidth
            {...register("post_number", {
              required: "Toto pole je povinné",
              pattern: /^\d{5}$/
            })}
            label="PSČ (bez mezer)"
            autoComplete="postal-code"
          />
        </div>
        <div className="flex mt-2 gap-2">
          <TextField
            label="Současné heslo"
            {...register("password", {
              required: true,
              pattern: /^.{6,}$/,
            })}
            fullWidth
            helperText={errors.password?.message as any}
            type={hidePassword ? "password" : "text"}
            slotProps={{
              formHelperText: { sx: { color: (t) => t.palette.error.main } },
              input: {
                endAdornment: (
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setHidePassword((c) => !c)}
                    edge="end"
                  >
                    {hidePassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                )
              }
            }}
          />
          <TextField
            label="Nové heslo"
            {...register("newPassword", {
              required: true,
              pattern: /^.{6,}$/,
            })}
            fullWidth
            type={hidePassword ? "password" : "text"}
            slotProps={{
              input: {
                endAdornment: (
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setHidePassword((c) => !c)}
                    edge="end"
                  >
                    {hidePassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                )
              }
            }}
          />
        </div>
        <FormControlLabel
          control={
            <Checkbox
              {...register("conditions", { required: true })}
            />
          }
          label={
            <Typography variant="body2">
              Seznámil jsem se s <Link href="/podminky.pdf">podmínkami zpracování osobních údajů</Link> a
              uděluji k tomu organizaci ZO Gymnázium J. K. Tyla souhlas
            </Typography>
          }
        />
        <Button
          disabled={!isValid || !isDirty}
          variant="contained"
          type="submit"
          fullWidth
        >
          Odeslat
        </Button>
      </form>
    </Paper >
  );
}
