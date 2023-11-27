"use client";
import { store } from "@/store/store";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Alert,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function Page({ searchParams }: { searchParams: any }) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const path = useSearchParams().get("invalid");
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm();
  const onSubmit = (data: any) => {
    setLoading(true);
    signIn("credentials", {
      email: data.email,
      password: data.password,
    });
  };

  useEffect(() => {
    if (path) {
      toast.error("Nepodařilo se přihlásit.");
    }
  }, [path]);

  return (
    <Paper className="p-2 flex flex-col gap-2">
      <Typography variant="h5">Přihlašovací formulář</Typography>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
        <TextField
          type="text"
          label="Email"
          variant="outlined"
          {...register("email", { required: true })}
        />

        <TextField
          type={showPassword ? "text" : "password"}
          variant="outlined"
          label="Heslo"
          {...register("password", { required: true })}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <LoadingButton
          type="submit"
          variant="contained"
          loading={loading}
          disabled={!isValid}
        >
          Přihlásit se
        </LoadingButton>
      </form>
      <Button variant="contained" onClick={() => signIn("google")}>
        GOOGLE
      </Button>
      {searchParams.error && (
        <Alert severity="error">Nepodařilo se přihlásit</Alert>
      )}
    </Paper>
  );
}
