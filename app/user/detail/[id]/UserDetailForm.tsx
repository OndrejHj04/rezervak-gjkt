"use client";
import { store } from "@/store/store";
import DateDefaultInput from "@/sub-components/DateDefaultInput";
import AvatarWrapper from "@/ui-components/AvatarWrapper";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { User } from "next-auth";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import NoAccountsIcon from "@mui/icons-material/NoAccounts";
import HotelIcon from "@mui/icons-material/Hotel";
import GoogleIcon from "@mui/icons-material/Google";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  outline: "none",
  transform: "translate(-50%, -50%)",
};

export default function UserDetailForm({ id }: { id: string }) {
  const { roles, user } = store();
  const [loading, setLoading] = useState(true);
  const [data, setUser] = useState<User | null | any>(null);
  const [sleep, setSleep] = useState(false);
  const fetchUser = async () => {
    fetch(`http://localhost:3000/api/users/detail/${id}`)
      .then((res) => res.json())
      .then(({ data }) => {
        setUser(data);
        setLoading(false);
      });
  };
  const isAdmin = user?.role.role_id === 1;
  const googleAccount = data?.email.split("@")[1] === "gmail.com";

  useEffect(() => {
    fetchUser();
  }, []);

  const methods = useForm<User>();

  const {
    register,
    handleSubmit,
    formState: { dirtyFields, isDirty },
  } = methods;

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
        setUser(data);
        toast.success("Uživatel byl upraven");
      });
  };

  const makeUserSleep = () => {
    fetch(`http://localhost:3000/api/users/edit/${data?.id}`, {
      body: JSON.stringify({ active: false }),
      method: "POST",
    })
      .then((res) => res.json())
      .then(({ data }) => {
        setSleep(false);
        toast.success(
          `Uživatel ${data?.first_name} ${data?.last_name} byl uspán`
        );
      });
  };

  const content = (
    <>
      <Modal open={sleep} onClose={() => setSleep(false)}>
        <Paper sx={style} className="p-4 flex flex-col gap-2 max-w-sm">
          <div className="flex items-center justify-between">
            <NoAccountsIcon sx={{ color: "#ED9191", fontSize: 36 }} />
            <Typography variant="h5">Uspat uživatele</Typography>
            <NoAccountsIcon sx={{ color: "#ED9191", fontSize: 36 }} />
          </div>
          <Divider />
          <Box className="flex items-center gap-2">
            <AvatarWrapper data={data!} />
            <Typography variant="h6">
              {data?.first_name} {data?.last_name}
            </Typography>
          </Box>
          <Divider />
          <Typography className="text-justify">
            Uspání uživatele mu znemožňuje jakoukoliv interakci s aplikací. Není
            možné provádět rezervace, ani spravovat svůj účet. Uživateli bude
            administrátor moci kdykoliv znovu přiřadit stav aktivního účtu.
          </Typography>
          <Button color="error" variant="contained" onClick={makeUserSleep}>
            deaktivovat
          </Button>
        </Paper>
      </Modal>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box className="w-full flex items-end gap-2">
            <Box className="ml-auto flex gap-2">
              {isAdmin && data?.role.role_id !== 1 && (
                <Button
                  color="error"
                  variant="outlined"
                  onClick={() => setSleep(true)}
                >
                  Uspat uživatele
                </Button>
              )}

              <Button variant="contained" type="submit" disabled={!isDirty}>
                Uložit
              </Button>
            </Box>
          </Box>
          {data && (
            <Box className="w-full flex gap-4">
              <Paper className="p-4 flex flex-col gap-2 aspect-square items-center justify-center">
                <AvatarWrapper data={data} />
              </Paper>
              <Paper className="p-4 flex flex-col gap-2">
                <TextField
                  defaultValue={data.first_name}
                  label="Jméno"
                  {...register("first_name")}
                />
                <TextField
                  defaultValue={data.last_name}
                  label="Příjmení"
                  {...register("last_name")}
                />
                <TextField
                  defaultValue={data.email}
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
                    defaultValue={data.role.role_id}
                    disabled={!isAdmin}
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
                  disabled={!isAdmin || data.role.role_id === 1}
                  control={
                    <Switch
                      defaultChecked={data.verified}
                      {...register("verified")}
                    />
                  }
                  label="Ověřený účet"
                />
                {googleAccount && (
                  <Paper className="w-full flex gap-2 items-center">
                    <GoogleIcon sx={{ width: 28, height: 28 }} />
                    <Typography variant="body2">
                      Tento účet je propojen s Google
                    </Typography>
                    <GoogleIcon sx={{ width: 28, height: 28 }} />
                  </Paper>
                )}
              </Paper>
              <Paper className="p-4 flex flex-col gap-2">
                <TextField
                  defaultValue={data.adress}
                  label="Adresa"
                  disabled={!isAdmin}
                  {...register("adress")}
                />
                <TextField
                  defaultValue={data.ID_code}
                  label="Číslo OP"
                  disabled={!isAdmin}
                  {...register("ID_code")}
                />
                <DateDefaultInput birth={data.birth_date} isAdmin={isAdmin} />
                {!isAdmin && (
                  <Button variant="outlined">Vyžádat změnu údajů</Button>
                )}
              </Paper>
            </Box>
          )}
        </form>
      </FormProvider>
    </>
  );

  if (loading)
    return (
      <Paper className="flex p-4 justify-center">
        <CircularProgress />
      </Paper>
    );

  if (data && !data.active) {
    return (
      <>
        <div className="absolute z-50">
          <Paper className="p-4 flex flex-col gap-2 max-w-sm">
            <Box className="flex justify-between items-center gap-5">
              <HotelIcon sx={{ color: "#4579ac", fontSize: 36 }} />
              <Typography variant="h5">Pššš! Tento účet spí</Typography>
              <HotelIcon sx={{ color: "#4579ac", fontSize: 36 }} />
            </Box>

            <Typography variant="h6" className="text-center">
              Uživatel: {data.first_name} {data.last_name}
            </Typography>
            <Divider />
            <Typography className="text-justify">
              Tato akce byla vyvolána administrátorem.
            </Typography>
          </Paper>
        </div>
        <Box sx={{ filter: "blur(5px)", pointerEvents: "none" }}>{content}</Box>
      </>
    );
  }

  return content;
}
