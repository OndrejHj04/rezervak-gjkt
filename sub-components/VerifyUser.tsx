"use client";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import RunningWithErrorsIcon from "@mui/icons-material/RunningWithErrors";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { store } from "@/store/store";
import { signIn, useSession } from "next-auth/react";
import { Session } from "next-auth";
import DateInput from "./DateInput";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState } from "react";
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
  const methods = useForm<verifyForm>();
  const { setUser, setUserLoading } = store();
  const [hidePassword, setHidePassword] = useState(true);
  const onSubmit = (data: verifyForm) => {
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
              })}
              label="Číslo OP"
              sx={{ width: 215, marginTop: 1 }}
              InputProps={{
                inputComponent: (props) => (
                  <Cleave
                    options={{
                      numericOnly: true,
                      blocks: [9],
                    }}
                    {...props}
                  />
                ),
              }}
            />
            <DateInput />
          </div>
          <div className="flex gap-2">
            <TextField
              label="Ulice a ČP"
              {...methods.register("street", {
                required: "Toto pole je povinné",
              })}
              sx={{ width: 130 }}
            />
            <TextField
              label="Město"
              {...methods.register("town", {
                required: "Toto pole je povinné",
              })}
              sx={{ width: 160 }}
            />

            <TextField
              {...methods.register("post_number", {
                required: "Toto pole je povinné",
                pattern: /[0-9 ]{6}$/,
              })}
              label="PSČ"
              sx={{ width: 130 }}
              InputProps={{
                inputComponent: (props) => (
                  <Cleave
                    options={{
                      numericOnly: true,
                      blocks: [3, 2],
                      delimiter: " ",
                    }}
                    {...props}
                  />
                ),
              }}
            />
          </div>

          <div className="flex gap-2">
            <TextField
              label="Současné heslo"
              {...methods.register("password", {
                required: "Toto pole je povinné",
              })}
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
              })}
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

          <Button variant="contained" type="submit">
            Odeslat
          </Button>
        </form>
      </FormProvider>
    </Paper>
  );
}
