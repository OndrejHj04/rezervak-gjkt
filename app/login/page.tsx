"use client";
import { store } from "@/store/store";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
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

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);
  const path = useSearchParams().get("invalid");
  const { register, handleSubmit } = useForm();
  const { setUserLoading } = store();
  const { push } = useRouter();
  const onSubmit = (data: any) => {
    signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    }).then((res) => {
      if (res?.error) {
        toast.error("Nepodařilo se přihlásit.");
      } else {
        setUserLoading(true);
        push("/login?invalid=true");
      }
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
          {...register("email")}
        />

        <TextField
          type={showPassword ? "text" : "password"}
          variant="outlined"
          label="Heslo"
          {...register("password")}
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
        <Button type="submit" variant="contained">
          Přihlásit se
        </Button>
      </form>
      <Button variant="contained" onClick={() => signIn("google")}>
        GOOGLE
      </Button>
    </Paper>
  );
}
