import ChangeAvatar from "@/sub-components/ChangeAvatar";
import { Role } from "@/types";
import {
  Avatar,
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { setServers } from "dns";
import { User } from "next-auth";

const getUserData = async (id: String) => {
  const req = await fetch(`http://localhost:3000/api/users/detail/${id}`, {
    cache: "no-cache",
  });
  const { data } = await req.json();
  return data as User;
};

const getUserRoles = async () => {
  const req = await fetch(`http://localhost:3000/api/roles/list`, {
    cache: "no-cache",
  });
  const { data } = await req.json();
  return data as Role[];
};

export default async function UserDetail({
  params: { id },
}: {
  params: { id: string };
}) {
  const data = await getUserData(id);
  const roles = await getUserRoles();

  return (
    <Box className="w-full">
      <Box className="w-full flex items-end">
        <Button variant="contained" className="ml-auto">
          Uložit
        </Button>
      </Box>
      <Box className="w-full flex gap-4">
        <Paper className="p-4 flex flex-col gap-2 aspect-square items-center justify-center">
          <ChangeAvatar img={data.image} />
        </Paper>
        <Paper className="p-4 flex flex-col gap-2">
          <TextField defaultValue={data.name} label="Uživatelské jméno" />
          <TextField defaultValue={data.email} label="Email" />
        </Paper>
        <Paper className="p-4 flex flex-col gap-2">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Role</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              defaultValue={data.role.role_id}
              label="Role"
            >
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.role_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>
      </Box>
    </Box>
  );
}
