import {
  Autocomplete,
  Box,
  Button,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import AvatarWrapper from "@/ui-components/AvatarWrapper";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  outline: "none",
  transform: "translate(-50%, -50%)",
};

export default function AddUserModal({
  currentUsers,
}: {
  currentUsers: number[];
}) {
  const [users, setUsers] = useState(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/list`)
      .then((res) => res.json())
      .then((res) => setUsers(res.data));
  }, []);

  return (
    <Paper sx={style} className="p-2 flex flex-col">
      <Typography variant="h5" className="mb-2 text-center">
        Přidat uživatele
      </Typography>
      {users ? (
        <Autocomplete
          sx={{ width: 300 }}
          multiple
          filterSelectedOptions
          getOptionDisabled={(option: any) => currentUsers.includes(option.id)}
          options={users}
          getOptionLabel={(option: any) =>
            `${option.first_name} ${option.last_name}`
          }
          renderOption={(props: any, option: any) => (
            <div {...props}>
              <Box className="flex items-center gap-2">
                <AvatarWrapper data={option} />
                <Typography className="ml-2">
                  {option.first_name} {option.last_name}
                </Typography>
              </Box>
            </div>
          )}
          renderInput={(params) => (
            <TextField {...params} label="Vybrat uživatele..." />
          )}
        />
      ) : (
        <CircularProgress />
      )}
      <Button variant="contained" className="mt-2">
        Uložit
      </Button>
    </Paper>
  );
}
